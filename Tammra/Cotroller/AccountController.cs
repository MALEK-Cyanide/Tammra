using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Tammra.DTOs.Account;
using Tammra.Models;
using Tammra.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("account")]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jWTService;
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;

        public AccountController(JWTService jWTService , 
            SignInManager<User> signInManager ,
            UserManager<User> userManager)
        {
            _jWTService = jWTService;
            _signInManager = signInManager;
            _userManager = userManager;
        }
        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
            {
                return Unauthorized("Username or password is invalid");
            }
            if (user.EmailConfirmed == false)
            {
                return Unauthorized("Please Confirm your Email");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password , false);
            if (!result.Succeeded)
            {
                return Unauthorized("البريد الالكتروني او كلمة السر غير صحيح");
            }
            return CreateApplicationUserDto(user);
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto model)
        {
            if (await CheckEmailExitAsync(model.Email)) 
            {
                return BadRequest();
            }
            var userToAdd = new User
            {
                UserName = model.Email.ToLower(),
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email.ToLower(),
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(userToAdd, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }
            return Ok();
        }

        #region Privat Helper Method
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                JWT = _jWTService.JWTCreating(user)
            };
        }

        private async Task<bool> CheckEmailExitAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }
        #endregion
    }
}
