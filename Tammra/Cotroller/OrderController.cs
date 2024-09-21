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
using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using System.IO;
using System.Text;
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

        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentCreateRequest request)
        {
            try
            {
                var options = new PaymentIntentCreateOptions
                {
                    Amount = request.Amount,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> { "card" },
                };
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

                Oreder oreder = _context.Oreders.Where(x => x.UserId == userId).OrderByDescending(o => o.OrderDate).FirstOrDefault();
                oreder.PaymentWay = "تم الدفع عن طريق الفيزا";

                _context.Update(oreder);
                await _context.SaveChangesAsync();

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

                var service = new PaymentIntentService();
                var paymentIntent = await service.CreateAsync(options);

                return Ok(new { clientSecret = paymentIntent.ClientSecret });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("download-order/{email}")]
        public async Task<IActionResult> DownloadOrderPdf(string email)
        {
            User user = await _userManager.FindByEmailAsync(email);
            var CusId = user.Id;

            var order = await _context.Oreders
                .OrderByDescending(x => x.OrderId)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.UserId == CusId);

            var csvBuilder = new StringBuilder();
            csvBuilder.AppendLine($" كود طلبك : {order.OrderNum}");
            csvBuilder.AppendLine($" وقت الطلب  : {order.OrderDate}");
            csvBuilder.AppendLine("اسم المنتج              |   الكمية   |   السعر");


            foreach (var item in order.OrderItems)
            {
                csvBuilder.AppendLine($"{item.Product.ProductName}            |   {item.Quantity}   |   {item.Price}");

            }
            var csvData = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(csvBuilder.ToString())).ToArray();

            return File(csvData, "text/csv; charset=utf-8", $"بيانات طلبك.csv");
        }
    }
}
public class PaymentIntentCreateRequest
{
    public long Amount { get; set; }
    public string Email { get; set; }
}