using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using Tammra.Data;
using Tammra.Models;
using Microsoft.AspNetCore.Identity;
using Tammra.DTOs.Cart;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;

        public CartController(Context context , UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpPost("add-to-cart")]
        public async Task<IActionResult> AddToCart([FromForm] string productID, [FromForm] string email, [FromForm] int quantity)
        {
            User user =await _userManager.FindByEmailAsync(email);
            var UserId = user.Id;

            int productId = int.Parse(productID);

            var cart = await _context.Carts.FirstOrDefaultAsync(c => c.UserId == UserId);
            if (cart == null)
            {
                cart = new Cart { UserId = UserId, CreatedDate = DateTime.Now };
                _context.Carts.Add(cart);
                await _context.SaveChangesAsync();
            }

            var cartItem = await _context.CartItems
                .FirstOrDefaultAsync(ci => ci.CartId == cart.CartId && ci.ProductId == productId);
            
            var cartItemDto = new CartItemDto();
            if (cartItem == null)
            {
                cartItem = new CartItem { CartId = cart.CartId, ProductId = productId, Quantity = quantity };
                cartItemDto = new CartItemDto
                {
                    CartId = cartItem.CartId,
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                };
                _context.CartItems.Add(cartItem);
            }
            else
            {
                cartItem.Quantity += quantity;
            }

            await _context.SaveChangesAsync();
            return Ok(cartItemDto);
        }

        [HttpGet("get-cart/{email}")]
        public async Task<IActionResult> GetCart(string email)
        {
            try
            {
                // Fetch the user
                User user = await _userManager.FindByEmailAsync(email);
                if (user == null)
                {
                    return NotFound("User not found.");
                }

                var UserId = user.Id;

                var cartItems = await _context.CartItems
                    .Where(ci => ci.Cart.UserId == UserId)
                    .Include(ci => ci.Product)
                    .ToListAsync();
                var prodId = _context.CartItems.Where(ci => ci.Cart.UserId == UserId).FirstOrDefault();
                var prod = _context.Products.Where(x => x.ProductId == prodId.ProductId).FirstOrDefault();
                double totalQ = prod.Quantity;

                var cartItemDtos = cartItems.Select(ci => new CartItemDto
                {
                    CartItemId = ci.CartItemId,
                    ProductId = ci.Product.ProductId,
                    ProductName = ci.Product.ProductName,
                    Price = ci.Product.Price,
                    Quantity = ci.Quantity,
                    Image = ci.Product.ProdImagePath,
                    TotalPrice = ci.Product.Price * ci.Quantity,
                    PriceAfterSale = ci.Product.PriceAfterSale,
                    TotalQuantity = totalQ
                }).ToList();

                return Ok(cartItemDtos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("delete-cart/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var cartItem = await _context.CartItems.Where(x => x.ProductId == id).FirstOrDefaultAsync();
            if (cartItem == null)
            {
                return NotFound();
            }

            _context.CartItems.Remove(cartItem);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("change-amount")]
        public async Task<IActionResult> ChangeQ([FromForm] int id , [FromForm] int quntity)
        {
            var cartItem = await _context.CartItems.Where(x => x.CartItemId == id).FirstOrDefaultAsync();
            if (cartItem == null)
            {
                return NotFound();
            }
            cartItem.Quantity = quntity;

            _context.CartItems.Update(cartItem);
            await _context.SaveChangesAsync();
            return Ok();
        }

    }
}
