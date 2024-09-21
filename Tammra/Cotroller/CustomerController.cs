using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using SkiaSharp;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tammra.Data;
using Tammra.DTOs;
using Tammra.Models;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly Context context;

        public CustomerController(UserManager<User> userManager , Context _context )
        {
            _userManager = userManager;
            context = _context;
        }
        [HttpGet("customer-data/{email}")]
        public async Task<IActionResult> GetCustomerData(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            User CustomerData = await _userManager.FindByEmailAsync(email);
            if (CustomerData == null)
            {
                return NotFound("Customer data not found");
            }

            return Ok(CustomerData);
        }

        [HttpPut("update-settings")]
        public async Task<IActionResult> UpdateUser([FromForm] string email, [FromForm] string customer, [FromForm] IFormFile imageProfile)
        {
            var Vendor = JsonConvert.DeserializeObject<User>(customer);

            User userInDb = await _userManager.FindByEmailAsync(email);
            if (userInDb == null)
            {
                return NotFound();
            }
            if (imageProfile != null)
            {
                var folderPathForVendorProfile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "CustomerProfile");
                if (!Directory.Exists(folderPathForVendorProfile))
                {
                    Directory.CreateDirectory(folderPathForVendorProfile);
                }

                var fileNameForProfile = Path.GetFileNameWithoutExtension(imageProfile.FileName);
                var extensionForProfile = Path.GetExtension(imageProfile.FileName);
                var uniqueFileNameForProfile = $"{fileNameForProfile}_{System.Guid.NewGuid()}{extensionForProfile}";

                var relativePathForProfile = "/images/CustomerProfile/" + uniqueFileNameForProfile;
                var filePathForProfile = Path.Combine(folderPathForVendorProfile, uniqueFileNameForProfile);

                using (var stream = new FileStream(filePathForProfile, FileMode.Create))
                {
                    await imageProfile.CopyToAsync(stream);
                }
                userInDb.CustomerImagePath = relativePathForProfile;

            }
            else if (imageProfile == null)
            {
                if (userInDb.CustomerImagePath != null)
                {
                    userInDb.CustomerImagePath = userInDb.CustomerImagePath;
                }
                else
                {
                    userInDb.CustomerImagePath = "/images/CustomerProfile/profile.png";

                }
            }
            userInDb.FirstName = Vendor.FirstName;
            userInDb.LastName = Vendor.LastName;
            userInDb.PhoneNumber = Vendor.PhoneNumber;
            userInDb.Gender = Vendor.Gender;
            userInDb.Birthday = Vendor.Birthday;

            await _userManager.UpdateAsync(userInDb);

            return Ok(userInDb);
        }
        [HttpGet("get-order/{email}")]
        public async Task<IActionResult> GetOrdersData(string email)
        {
            User CustomerData = await _userManager.FindByEmailAsync(email);
            var UserId = CustomerData.Id;

            var orders = await context.Oreders.Where(x => x.UserId == UserId).ToListAsync();
            var orderDtos = orders.Select(order => new OrderDto
            {
                OrderId = order.OrderId,
                OrderDate = order.OrderDate, 
                TotalAmount = order.TotalAmount,
                OrderNum = order.OrderNum,
                PaymentWay = order.PaymentWay,
                Status = order.Status
            }).ToList();

            return Ok(orderDtos);
        }
        [HttpGet("get-order-info/{id}")]
        public async Task<IActionResult> GetOrderInfo(int id)
        {
            Oreder oreder = await context.Oreders.Where(x => x.OrderId == id).FirstOrDefaultAsync();
            return Ok(oreder);
        }
        [HttpPost("add-rate")]
        public async Task<IActionResult> SaveRate([FromForm] string rate, [FromForm]string id)
        {
            var ProdId = int.Parse(id); 
            var RateProd = int.Parse(rate);
            Product product = context.Products.Where(x => x.ProductId == ProdId).FirstOrDefault();

            product.Rate += RateProd;
            context.Update(product);
            await context.SaveChangesAsync();

            return Ok();
        }
    }
}
