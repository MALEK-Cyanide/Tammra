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
        private readonly IWebHostEnvironment _env;

        public ProductController(Context context, UserManager<User> userManager , IWebHostEnvironment env)
        {
            _context = context;
            _userManager = userManager;
            _env = env;
        }
        [HttpGet("all-product")]
        public async Task<IActionResult> GetAllProductsForUser([FromQuery] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }
            //User user =await _userManager.FindByEmailAsync(email);
            //var UserId = await _userManager.GetUserIdAsync(user);

            var userProducts =await _context.Products.Where(p => p.User.Email == email).ToListAsync();

            if (!userProducts.Any())
            {
                return NotFound("No products found for this user");
            }

            return Ok(userProducts);
        }
        [HttpPost("add-product")]
        public async Task<IActionResult> CreateProduct([FromForm] string product, [FromForm] IFormFile image)
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

        [HttpGet("getImage/{id}")]
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
