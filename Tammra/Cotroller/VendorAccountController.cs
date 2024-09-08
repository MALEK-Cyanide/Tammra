using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("vendor")]
    public class VendorAccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public VendorAccountController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet("get-settings")]
        public async Task<IActionResult> GetVendorData([FromQuery] string email)
        {
            User user = await _userManager.FindByEmailAsync(email);
            
            return Ok(user);
        }

        [HttpPut("settings/{email:alpha}")]
        public async Task<IActionResult> UpdateUser(string email, [FromBody] User user)
        {
            User userInDb = await _userManager.FindByEmailAsync(email);
            if (userInDb == null)
            {
                return NotFound();
            }

            userInDb.FirstName = user.FirstName;
            userInDb.LastName    = user.LastName;
            userInDb.PhoneNumber = user.PhoneNumber;
            userInDb.Description = user.Description;
            //userInDb.Address = user.Address;
            userInDb.CompanyName = user.CompanyName;
            //userInDb.Navigation = user.Navigation;
            userInDb.VendorCoverPath = user.VendorCoverPath;
            userInDb.VendorImagePath = user.VendorImagePath;

            try
            {
                await _userManager.UpdateAsync(userInDb);
            }
            catch (DbUpdateConcurrencyException)
            {
                return StatusCode(500, "Error updating user data");
            }

            return Ok(userInDb);
        }
    }
}
