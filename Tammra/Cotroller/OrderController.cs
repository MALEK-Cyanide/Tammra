using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;
using Tammra.Data;
using Tammra.Models;
using Microsoft.Extensions.Configuration;
using Stripe;
using System.Collections.Generic;
using Mailjet.Client.Resources;
using User = Tammra.Models.User;
using Product = Tammra.Models.Product;
namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration configuration;

        private string PayPalCleintId { get; set; } = "";
        private string PayPalSecret { get; set; } = "";
        private string PayPalUrl { get; set; } = "";
        public OrderController(Context context, UserManager<User> userManager , IConfiguration _configuration)
        {
            _context = context;
            _userManager = userManager;
            PayPalCleintId  = _configuration["PaypalSettings:ClientId"];
            PayPalSecret = _configuration["PaypalSettings:Secret"];
            PayPalUrl = _configuration["PaypalSettings:Url"];
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
                Status = "معلق",
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
        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentCreateRequest request)
        {
            User user = await _userManager.FindByEmailAsync(request.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            var userId = user.Id;
            var cartItems = await _context.CartItems
                .Where(ci => ci.Cart.UserId == userId)
                .Include(ci => ci.Product)
                .ToListAsync();

            foreach (var cartItem in cartItems)
            {
                Product product = cartItem.Product;

                if (product == null)
                {
                    continue;
                }
                product.Quantity -= cartItem.Quantity;
            }
            _context.CartItems.RemoveRange(cartItems);
            await _context.SaveChangesAsync();
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                };

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

    }
}
public class PaymentIntentCreateRequest
{
    public long Amount { get; set; }
    public string Email { get; set; }
}