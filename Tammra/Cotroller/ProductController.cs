using Azure.Core;
using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tammra.Data;
using Tammra.DTOs.Product;
using Tammra.Models;
using static System.Net.Mime.MediaTypeNames;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("product")]
    public class ProductController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;

        public ProductController(Context context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("all-product")]
        public async Task<IActionResult> GetAllProductsForUser([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            var userProducts =await _context.Products.Where(p => p.User.Email == email).ToListAsync();

            if (!userProducts.Any())
            {
                return NotFound("No products found for this user");
            }

            return Ok(userProducts);
        }
        [HttpGet("get-all-products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            return Ok(products);
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> CreateProduct([FromForm] string product, [FromForm] IFormFile image , [FromForm] string rate)
        {
            var Product = JsonConvert.DeserializeObject<AddProductDto>(product);

            User user = await _userManager.FindByEmailAsync(Product.Email);
            var UserId = await _userManager.GetUserIdAsync(user);

            if (image == null || image.Length == 0)
                return BadRequest("Image not selected");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images" , "Products");
            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var fileName = Path.GetFileNameWithoutExtension(image.FileName);
            var extension = Path.GetExtension(image.FileName);
            var uniqueFileName = $"{fileName}_{System.Guid.NewGuid()}{extension}";

            var relativePath = "/images/Products/" + uniqueFileName;
            var filePath = Path.Combine(folderPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var pro = new Product
            {
                ProductName = Product.ProductName,
                Price = Product.Price,
                Quantity = Product.Quantity,
                Profit = Product.Profit,
                ProdImagePath = relativePath,
                DateAdded = DateTime.UtcNow,
                ProductionPrice = Product.ProductionPrice,
                Rate = double.Parse(rate),
                UserId = UserId
            };

            _context.Products.Add(pro);
            await _context.SaveChangesAsync();

            return Ok(Product);
        }
        
        [HttpGet("get-product/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            var productRating = await _context.Products
                                          .Where(r => r.ProductId == id)
                                          .AverageAsync(r => r.Rate);

            return Ok(product);    
        }
        [HttpGet("get-rate/{id}")]
        public async Task<ActionResult<Product>> GetRate(int id)
        {
            var productRating = await _context.Products
                                          .Where(r => r.ProductId == id)
                                          .AverageAsync(r => r.Rate);

            return Ok(productRating);
        }

        [HttpPut("edit-product")]
        public async Task<IActionResult> UpdateProduct([FromForm] int id, [FromForm] string product , [FromForm] IFormFile image)
        {
            var angProduct = JsonConvert.DeserializeObject<EditProductDto>(product);

            User user = await _userManager.FindByEmailAsync(angProduct.Email);
            var UserId = await _userManager.GetUserIdAsync(user);

            if (id != angProduct.ProductId)
            {
                return BadRequest();
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            if(image != null)
            {
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "Products");
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var fileName = Path.GetFileNameWithoutExtension(image.FileName);
                var extension = Path.GetExtension(image.FileName);
                var uniqueFileName = $"{fileName}_{System.Guid.NewGuid()}{extension}";

                var relativePath = "/images/Products/" + uniqueFileName;
                var filePath = Path.Combine(folderPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }
                existingProduct.ProdImagePath = relativePath;
            }

            existingProduct.ProductName = angProduct.ProductName;
            existingProduct.DateUpdated = DateTime.UtcNow;
            existingProduct.Price = angProduct.Price;
            existingProduct.Quantity = angProduct.Quantity;
            existingProduct.ProductionPrice = angProduct.ProductionPrice;
            if(angProduct.IsOnSale == true)
            {
                existingProduct.IsOnSale = true;
                double sale = (angProduct.Price * angProduct.SalePrice) / 100;

                existingProduct.PriceAfterSale = angProduct.Price - sale;
                existingProduct.SalePrice = angProduct.SalePrice;
            }
            else
            {
                existingProduct.IsOnSale = false;
                existingProduct.SalePrice = 0;
                existingProduct.PriceAfterSale = 0;

            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("delete-product/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok();
        }

        private async Task<string> GetUserIdAsync(User user)
        {
            var userID = await _userManager.GetUserIdAsync(user);
            return userID;
        }

        [HttpPost("uplaod-image")]
        public async Task<string> UploadImage([FromForm] IFormFile image)
        {
            if (!Directory.Exists("wwwroot/images/Products"))
            {
                Directory.CreateDirectory("wwwroot/images/Products");
            }
            var imageName = Path.GetFileNameWithoutExtension(image.FileName);
            var extension = Path.GetExtension(image.FileName);

            var uniqueFileName = $"{imageName}_{System.Guid.NewGuid()}{extension}";

            var imagePath = Path.Combine("wwwroot/images/Products", uniqueFileName);

            

            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }
            
            return imagePath;
        }
        [HttpGet("search-product")]
        public IActionResult SearchProducts([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            var products = _context.Products.Where(p => p.ProductName.Contains(query)).ToList();
            return Ok(products);
        }
    }
}