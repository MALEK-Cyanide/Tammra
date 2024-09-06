using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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

        public ProductController(Context context , UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }
        [HttpGet("all-product")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Products.ToListAsync();
        }
        //[HttpPost("add-product")]
        //public IActionResult AddProduct(AddProductDto request)
        //{
        //    var product = new Product
        //    {
        //        ProductName = request.ProductName,
        //        Price = request.Price,
        //        Quantity= request.Quantity,
        //        Profit= request.Profit,
        //        ProdImagePath = request.ProdImagePath,
        //        DateAdded = DateTime.UtcNow,
        //        UserId = request.UserId
        //    };
        //    _context.Products.Add(product);
        //    _context.SaveChanges();
        //    return Ok("Created");
        //}
        [HttpPost("add-product")]
        public async Task<IActionResult> PostProduct([FromBody] AddProductDto request)
        {
            var user = _userManager.FindByEmailAsync(request.Email);
            if (user == null)
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
                UserId = user.Id.ToString()
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return Ok();
        }

        // GET: api/products/{id}
        [HttpGet("get-product/{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
    }
}
