using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using Tammra.Data;
using Tammra.Models;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;
        public OrderController(Context context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("checkout/{email}")]
        public async Task<IActionResult> Checkout(string email)
        {
            User user = await _userManager.FindByEmailAsync(email);
            var UserId = user.Id;

            var cartItems = await _context.CartItems
                .Where(ci => ci.Cart.UserId == UserId)
                .Include(ci => ci.Product)
                .ToListAsync();

            if (!cartItems.Any())
                return BadRequest("Cart is empty");

            var order = new Oreder
            {
                UserId = UserId,
                OrderDate = DateTime.Now,
                TotalAmount = cartItems.Sum(ci => ci.Product.Price * ci.Quantity),
                OrderItems = cartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                }).ToList()
            };

            _context.Oreders.Add(order);
            await _context.SaveChangesAsync();

            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();

            return Ok(order);
        }
    }
}
