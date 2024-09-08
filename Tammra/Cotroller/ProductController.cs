using Azure.Core;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
    [Route("product")]
    public class ProductController : ControllerBase
    {
        private readonly Context _context;
        private readonly UserManager<User> _userManager;
        private readonly IWebHostEnvironment _env;

        public ProductController(Context context, UserManager<User> userManager , IWebHostEnvironment env)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
        }
        [HttpGet("all-product")]
        public IActionResult GetAllProductsForUser([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            var userProducts = _context.Products.Where(p => p.User.Email == email).ToList();

            if (!userProducts.Any())
            {
                return NotFound("No products found for this user");
            }

            return Ok(userProducts);
        }
        [HttpPost("add-product")]
        public async Task<IActionResult> PostProduct(AddProductDto request)
        {
            User user = await _userManager.FindByEmailAsync(request.Email);
            var userID = await GetUserIdAsync(user);
            if (user == null || userID == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var product = new Product
            {
                ProductName = request.ProductName,
                Price = request.Price,
                Quantity = request.Quantity,
                Profit = request.Profit,
                ProdImagePath = request.ProdImagePath,
                DateAdded = DateTime.UtcNow,
                ProductionPrice = request.ProductionPrice,
                UserId = userID
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("get-product/{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return product;
        }

        [HttpPut("edit-product/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, EditProductDto product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound();
            }
            existingProduct.ProductName = product.ProductName;
            existingProduct.DateUpdated = DateTime.UtcNow;
            existingProduct.Price = product.Price;
            existingProduct.Quantity = product.Quantity;
            existingProduct.ProductionPrice = product.ProductionPrice;
            existingProduct.ProdImagePath = product.ProdImagePath;

            try
            {
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Products.Any(p => p.ProductId == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
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
        public async Task<IActionResult> UploadImage([FromForm] IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image uploaded.");
            }

            var uploadsPath = Path.Combine(_env.WebRootPath, "uploads" , image.FileName);

            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var fileName = Path.GetFileNameWithoutExtension(image.FileName);
            var extension = Path.GetExtension(image.FileName);
            var uniqueFileName = $"{fileName}_{System.Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(uploadsPath, uniqueFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            var relativePath = Path.Combine("uploads", uniqueFileName);
            var imageUrl = "/uploads/" + uniqueFileName;
            return Ok(imageUrl);
        }
        [HttpGet("getImage/{id}")]
        //public async Task<IActionResult> GetImage(int id)
        //{
        //     var image = await _context.Products.FirstOrDefaultAsync(i => i.ProductId == id);

        //    if (image == null || string.IsNullOrEmpty(image.ProdImagePath))
        //    {
        //        return NotFound();
        //    }

        //    // Get the image file path
        //    var imagePath = Path.Combine(image.ProdImagePath);

        //    // Check if the file exists
        //    //if (!System.IO.File.Exists(imagePath))
        //    //{
        //    //    return NotFound();
        //    //}

        //    byte[] imageBytes = System.IO.File.ReadAllBytes(imagePath);
        //    return File(imageBytes, "image/PNG");
        //}
        public async Task<IActionResult> GetImage(int id)
        {
            Product image = await _context.Products.FirstOrDefaultAsync(i => i.ProductId == id);
            if (image == null)
            {
                return NotFound("Image not found");
            }
            string filePath = image.ProdImagePath;


            return Ok(filePath);
        }
        private string GetImageUrlFromDatabase(int id)
        {
            var image = _context.Products.FirstOrDefault(i => i.ProductId == id);
            return image?.ProdImagePath;
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
