using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Numerics;
using System.Threading.Tasks;
using Tammra.Data;
using Tammra.Data.Migrations;
using Tammra.DTOs;
using Tammra.Models;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly Context context;

        public PaymentController(UserManager<User> userManager , Context _context)
        {
            _userManager = userManager;
            context = _context;
        }
        [HttpGet("get-total-price/{email}")]
        public async Task<IActionResult> GetPaymentData(string email)
        {
            double TotalPrice = 0, inSale = 0 , outSale = 0;
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            User CustomerData = await _userManager.FindByEmailAsync(email);
            var CustId = CustomerData?.Id;

            if (CustomerData == null)
            {
                return NotFound("Customer data not found");
            }
            var cartItems = await context.CartItems
                .Where(ci => ci.Cart.UserId == CustId)
                .Include(ci => ci.Product)
                .ToListAsync();
            foreach (var cartItem in cartItems)
            {
                if(cartItem.Product.IsOnSale == true)
                {
                    inSale += cartItem.Product.PriceAfterSale * cartItem.Quantity;
                }
                else if(cartItem.Product.IsOnSale == false)
                {
                    outSale = cartItem.Product.Price * cartItem.Quantity;
                }
                TotalPrice = inSale + outSale;
            }

            return Ok(TotalPrice);
        }

        [HttpPost("make-order")]
        public async Task<IActionResult> MakeOrder([FromForm] string order, [FromForm] string email , [FromForm] string totalP , [FromForm] string phone)
        {
            User user = await _userManager.FindByEmailAsync(email);
            var UserId = user.Id;

            var orderDto = JsonConvert.DeserializeObject<OrderDto>(order);

            double TotalPrice = double.Parse(totalP);

            Guid guid = Guid.NewGuid();
            string guidString = guid.ToString("N");
            string orderNumber = guidString.Substring(0, 8).ToUpper();

            var cartItems = await context.CartItems
                .Where(ci => ci.Cart.UserId == UserId)
                .Include(ci => ci.Product)
                .ToListAsync();

            Oreder oreder = new Oreder
            {
                UserId = user.Id,
                Governorate = orderDto.Governorate,
                City = orderDto.City,
                Street = orderDto.Street,
                AddressDetails = orderDto.AddressDetails,
                TotalAmount = TotalPrice,
                OrderNum = orderNumber,
                Status = "Pending",
                PhoneNumber = phone,
                OrderItems = cartItems.Select(ci => new OrderItem
                {
                    ProductId = ci.ProductId,
                    Quantity = ci.Quantity,
                    Price = ci.Product.Price
                }).ToList()
            };

            if (oreder.Governorate != null && oreder.City != null && oreder.Governorate != "" && oreder.City != "")
            {
                context.Oreders.Add(oreder);
                await context.SaveChangesAsync();
            }
            //context.CartItems.RemoveRange(cartItems);
            //await context.SaveChangesAsync();

            return Ok();
        }
        [HttpGet("get-order/{email}")]
        public async Task<IActionResult> GetOrderData(string email)
        {
            User CustomerData = await _userManager.FindByEmailAsync(email);
            var CustId = CustomerData?.Id;


            var order = context.Oreders.Include(o => o.OrderItems)
                    .Where(o => o.UserId == CustId)
                    .OrderByDescending(o => o.OrderDate)
                    .FirstOrDefault();

            var or = new OrderDto
            {
                PhoneNumber = order.PhoneNumber,
                OrderNum = order.OrderNum,
                AddressDetails= order.AddressDetails,
                TotalAmount = order.TotalAmount,
                Governorate = order.Governorate,
                Street = order.Street,
                City = order.City
            };

            return Ok(or);
        }
    }
}
