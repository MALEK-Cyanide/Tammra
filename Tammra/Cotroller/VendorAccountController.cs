using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Tammra.Data;
using Tammra.Data.Migrations;
using Tammra.DTOs.Product;
using Tammra.DTOs.Vendor;
using Tammra.Models;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    public class VendorAccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;

        public VendorAccountController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet("vendor-data/{email}")]
        public async Task<IActionResult> GetVendorData(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required");
            }

            User vendorData = await _userManager.FindByEmailAsync(email);
            if (vendorData == null)
            {
                return NotFound("Vendor data not found");
            }

            return Ok(vendorData);
        }


        [HttpPut("update-settings")]
        public async Task<IActionResult> UpdateUser([FromForm] string email, [FromForm] string vendor, [FromForm] IFormFile imageProfile,  [FromForm] IFormFile imageCover)
        {
            var Vendor = JsonConvert.DeserializeObject<User>(vendor);

            User userInDb = await _userManager.FindByEmailAsync(email);
            if (userInDb == null)
            {
                return NotFound();
            }
            if (imageProfile != null)
            {
                var folderPathForVendorProfile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "VendorProfile");
                if (!Directory.Exists(folderPathForVendorProfile))
                {
                    Directory.CreateDirectory(folderPathForVendorProfile);
                }

                var fileNameForProfile = Path.GetFileNameWithoutExtension(imageProfile.FileName);
                var extensionForProfile = Path.GetExtension(imageProfile.FileName);
                var uniqueFileNameForProfile = $"{fileNameForProfile}_{System.Guid.NewGuid()}{extensionForProfile}";

                var relativePathForProfile = "/images/VendorProfile/" + uniqueFileNameForProfile;
                var filePathForProfile = Path.Combine(folderPathForVendorProfile, uniqueFileNameForProfile);

                using (var stream = new FileStream(filePathForProfile, FileMode.Create))
                {
                    await imageProfile.CopyToAsync(stream);
                }
                userInDb.VendorImagePath = relativePathForProfile;

            }
            else if(imageProfile == null)
            {
                if(userInDb.VendorImagePath != null)
                {
                    userInDb.VendorImagePath = userInDb.VendorImagePath;
                }
                else
                {
                    userInDb.VendorImagePath = "/images/VendorProfile/profile.png";

                }
            }

            if (imageCover != null)
            {
                var folderPathVendorCover = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "VendorCover");
                if (!Directory.Exists(folderPathVendorCover))
                {
                    Directory.CreateDirectory(folderPathVendorCover);
                }

                var fileNameForCover = Path.GetFileNameWithoutExtension(imageCover.FileName);
                var extensionForCover = Path.GetExtension(imageCover.FileName);
                var uniqueFileNameForCover = $"{fileNameForCover}_{System.Guid.NewGuid()}{extensionForCover}";

                var relativePathForCover = "/images/VendorCover/" + uniqueFileNameForCover;
                var filePathForCover = Path.Combine(folderPathVendorCover, uniqueFileNameForCover);

                using (var stream = new FileStream(filePathForCover, FileMode.Create))
                {
                    await imageCover.CopyToAsync(stream);
                }
                userInDb.VendorCoverPath = relativePathForCover;
            }
            else if(imageCover == null) 
            {
                if (userInDb.VendorCoverPath != null)
                {
                    userInDb.VendorCoverPath = userInDb.VendorCoverPath;
                }
                else
                {
                    userInDb.VendorCoverPath = "/images/VendorCover/cover.jpg";
                }
            }
            userInDb.FirstName = Vendor.FirstName;
            userInDb.LastName = Vendor.LastName;
            userInDb.PhoneNumber = Vendor.PhoneNumber;
            userInDb.Description = Vendor.Description;
            userInDb.CompanyName = Vendor.CompanyName;

            await _userManager.UpdateAsync(userInDb);

            return Ok(userInDb);
        }

        [HttpPost("save-location")]
        public async Task<IActionResult> SaveLocation([FromBody] LocationDto location)
        {
            var user = await _userManager.FindByEmailAsync(location.Email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            user.Latitude = location.Latitude;
            user.Longitude = location.Longitude;

            await _userManager.UpdateAsync(user);
            

            return Ok();
        }

        [HttpGet("get-location/{email}")]
        public async Task<IActionResult> GetLocation(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var location = new LocationDto
            {
                Email = user.Email,
                Latitude = user.Latitude,
                Longitude = user.Longitude
            };

            return Ok(location);
        }
        [HttpGet("search-vendor")]
        public IActionResult SearchVendor([FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest();
            }
            var user = _userManager.Users
                .Where(p => p.UserRole == "Vendor" && (p.FirstName.Contains(query) || p.LastName.Contains(query)))
                .ToList();
            return Ok(user);
        }
        
    }
}
