﻿using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tammra.Data;
using Tammra.DTOs.Product;
using Tammra.Models;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _environment;

        public AdminController(Context context, UserManager<User> userManager , IWebHostEnvironment environment)
        {
            _context = context;
            _userManager = userManager;
            _environment = environment;
        }
        [HttpGet("all-product")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products
        .Include(x => x.User)
        .Select(product => new
        {
            product.ProductId,
            product.ProductName,
            product.Price,
            CompanyName = product.User.CompanyName,
            product.Quantity,
            product.PriceAfterSale,
            product.IsOnSale,
            product.DateAdded,
            product.DateUpdated,
            product.ProdImagePath,
            product.Rate
        })
        .ToListAsync();
            return Ok(products);
        }
        [HttpGet("all-orders")]
        public async Task<IActionResult> GetOrders()
        {
            var order = await _context.Oreders.ToListAsync();
            return Ok(order);
        }
        [HttpPut("update-status-order")]
        public async Task<IActionResult> UpdateStatus([FromForm]string orderStatu)
        {
            var order = JsonConvert.DeserializeObject<Oreder>(orderStatu);

            Oreder oreder = _context.Oreders.Where(x => x.OrderId == order.OrderId).FirstOrDefault();

            oreder.Status = order.Status;

            _context.Oreders.Update(oreder);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpPut("delete-order")]
        public async Task<IActionResult> DeleteStatus([FromForm] string index)
        {
            int OrderID = int.Parse(index);

            Oreder oreder = _context.Oreders.Where(x => x.OrderId == OrderID).FirstOrDefault();

            oreder.Status = "تم إلغاء الطلب";

            _context.Oreders.Update(oreder);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpGet("order-details/{id}")]
        public async Task<IActionResult> OrderDetails(int id)
        {
            var orderItem = await _context.OrderItems.Where(x => x.OrderId == id)
                .Include(x => x.Product)
                .Select(or => new
                {
                    ProductId = or.Product.ProductId,
                    ProductName = or.Product.ProductName,
                    or.Quantity,
                    or.Price,
                })
                .ToListAsync();
            return Ok(orderItem);
        }
        [HttpGet("search-order")]
        public IActionResult SearchOrder([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            var order = _context.Oreders.Where(p => p.OrderNum.Contains(query)).ToList();
            return Ok(order);
        }

        [HttpGet("search-user")]
        public IActionResult SearchUser([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            var user = _userManager.Users.Where(p => (p.UserRole == "Vendor" || p.UserRole == "Customer") && (p.FirstName.Contains(query) || p.LastName.Contains(query))).ToList();
            return Ok(user);
        }
        [HttpGet("all-user")]
        public async Task<IActionResult> AllUser()
        {
            var user = await _userManager.Users.Where(x => x.UserRole == "Vendor" || x.UserRole == "Customer").ToListAsync();

            return Ok(user);
        }

        [HttpPut("change-info")]
        public async Task<IActionResult> ChangeInfo([FromForm] string user)
        {
            var UserInfo = JsonConvert.DeserializeObject<User>(user);

            User selUser = await _userManager.FindByEmailAsync(UserInfo.Email);

            selUser.FirstName = UserInfo.FirstName;
            selUser.LastName = UserInfo.LastName;
            selUser.UserRole = UserInfo.UserRole;
            selUser.Email = UserInfo.Email;
            selUser.PhoneNumber = UserInfo.PhoneNumber;

            await _userManager.UpdateAsync(selUser);
            return Ok();
        }
        [HttpPut("block-user")]
        public async Task<IActionResult> BlockUser([FromForm] string email)
        {

            User user = await _userManager.FindByEmailAsync(email);

            if(user.EmailConfirmed == true)
            {
                user.EmailConfirmed = false;
            }
            else
            {
                user.EmailConfirmed = true;
            }

            await _userManager.UpdateAsync(user);
            return Ok();
        }

        [HttpGet("get-coupon")]
        public async Task<IActionResult> AllCoupons()
        {
            var coupons = await _context.Coupons.ToListAsync();

            return Ok(coupons);
        }

        [HttpPost("add-coupon")]
        public async Task<IActionResult> AddCoupons([FromForm] string coupon)
        {
            var coup = JsonConvert.DeserializeObject<Coupon>(coupon);

            _context.Add(coup);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPut("edit-coupon")]
        public async Task<IActionResult> EditCoupons([FromForm] string coupon)
        {
            var coup = JsonConvert.DeserializeObject<Coupon>(coupon);

            Coupon couponEdit = _context.Coupons.Where(x => x.CouponID == coup.CouponID).FirstOrDefault();

            couponEdit.CouponName = coup.CouponName;
            couponEdit.CouponValue = coup.CouponValue;
            couponEdit.Quantity = coup.Quantity;

            _context.Coupons.Update(couponEdit);
            await _context.SaveChangesAsync();

            return Ok();
        }
        [HttpDelete("delete-coupon/{index}")]
        public async Task<IActionResult> DeleteCoupons(int index)
        {
            Coupon coupon = _context.Coupons.Where(x => x.CouponID == index).FirstOrDefault();
            _context.Coupons.Remove(coupon);
            await _context.SaveChangesAsync();
            return Ok();
        }
        [HttpPost("check-coupon")]
        public async Task<IActionResult> CheckCoupons([FromForm]string couponCode , [FromForm] string orederNum)
        {
            Coupon coupon = _context.Coupons.Where(x => x.CouponName == couponCode.Trim()).FirstOrDefault();
            if (coupon == null || coupon.Quantity == 0)
            {
                string message = "null";
                return BadRequest(message);
            }
            else
            {
                Oreder oreder = _context.Oreders.Where(x => x.OrderNum ==  orederNum).FirstOrDefault();

                oreder.TotalAmount -= ((oreder.TotalAmount * coupon.CouponValue) / 100);
                _context.Oreders.Update(oreder);
                await _context.SaveChangesAsync();

                coupon.Quantity--;
                _context.Coupons.Update(coupon);
                await _context.SaveChangesAsync();

                return Ok(oreder.TotalAmount+30);
            }
        }
        [HttpPost("upload-icon")]
        public async Task<IActionResult> UploadIcon([FromForm] IFormFile icon)
        {
            if (icon == null || icon.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var validExtensions = new[] { ".ico", ".png" };
            var fileExtension = Path.GetExtension(icon.FileName).ToLower();

            if (!validExtensions.Contains(fileExtension))
            {
                return BadRequest("Invalid file type. Only .ico and .png are allowed.");
            }

            var uploadPath = Path.Combine(_environment.WebRootPath, "WebsiteIcon");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }

            var filePath = Path.Combine(uploadPath, "favicon" + fileExtension);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await icon.CopyToAsync(stream);
            }

            return Ok();
        }
    }
}
