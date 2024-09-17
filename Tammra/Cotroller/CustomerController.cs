using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Tammra.Models;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public CustomerController(UserManager<User> userManager)
        {
            _userManager = userManager;
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
    }
}
