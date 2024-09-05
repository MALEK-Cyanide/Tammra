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
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Mailjet.Client.Resources;
using User = Tammra.Models.User;

namespace Tammra.Cotroller
{
    [Route("api/[controller]")]
    [ApiController]
    [Route("account")]
    public class AccountController : ControllerBase
    {
        private readonly JWTService _jWTService;
        private readonly SignInManager<User> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AccountController(JWTService jWTService , 
            SignInManager<User> signInManager ,
            UserManager<User> userManager,
            EmailService emailService,
            IConfiguration config,
            RoleManager<IdentityRole> roleManager)
        {
            _jWTService = jWTService;
            _signInManager = signInManager;
            _userManager = userManager;
            _emailService = emailService;
            _config = config;
        }
        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user == null) return Unauthorized("Username or password is invalid");

            if (user.EmailConfirmed == false) return Unauthorized("Please Confirm your Email");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password , false);
            if (!result.Succeeded)
            {
                return Ok(new {mess = "Bad Reqest"});
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
                UserRole = model.Role
            };

            var resultCreated = await _userManager.CreateAsync(userToAdd, model.Password);
            var resultRolled = await _userManager.AddToRoleAsync(userToAdd, model.Role);

            if (!resultCreated.Succeeded && !resultRolled.Succeeded)
            {
                return BadRequest(resultCreated.Errors);
            }
            //try
            //{
            //    if (await SendConfirmEmailAsync(userToAdd))
            //    {
                    return Ok(new JsonResult(new { title = "Created", message = "Done , Just confirm ur Email" }));
            //}
            //    return BadRequest("Faild to send email");
        //}
        //    catch (System.Exception)
        //    {

        //    return BadRequest("Faild to send email");
    //}
}

        [Authorize]
        [HttpGet("refresh-user-token")]
        public async Task<ActionResult<UserDto>> RefreshUserToken()
        {
            var user = await _userManager.FindByNameAsync(User.FindFirst(ClaimTypes.Email)?.Value);
            return CreateApplicationUserDto(user);
        }

        [HttpPut("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(ConfirmEmailDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                return Unauthorized("هذا البريد الإلكتروني لم يتم تسجيله");
            }
            if (user.EmailConfirmed == true)
            {
                return BadRequest("هذا البريد الإلكتروني مسجل بالفعل  قم بتسجيل الدخول");
            }
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.Token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
                if (result.Succeeded) {
                    return Ok(new JsonResult(new { title = "تأكيد البريد الإلكتروني" , message = "تم تأكيد بريدك الإلكتروني قم بتسجيل الدخول" }));
                }
                return BadRequest("Invalid Token");
            }
            catch (System.Exception)
            {
                return BadRequest("Invalid Token");
            }
        }

        [HttpPost("resend-email-confirm-link/{email}")]
        public async Task<IActionResult> ResendEmailConfirmLink(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Invalid Email");
            }
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null)  return Unauthorized("هذا البريد الإلكتروني لم يتم تسجيله");
            if (user.EmailConfirmed == true)  return BadRequest("هذا البريد الإلكتروني مسجل بالفعل  قم بتسجيل الدخول");

            try
            {
                if (await SendConfirmEmailAsync(user))
                {
                    return Ok(new JsonResult(new { title = "تم إرسال رابط التأكيد", message = "قم بتأكيد بريدك الإلكتروني" }));
                }
                return BadRequest("Invalid EMail");
            }
            catch (System.Exception)
            {
                return BadRequest("Invalid EMail");
            } 
        }

        [HttpPost("forget-username-or-password/{email}")]
        public async Task<IActionResult> ForgetUsernameOrPassword(string email)
        {
            if (string.IsNullOrEmpty(email)) return BadRequest("Invalid EMail");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized("هذا البريد الإلكتروني لم يتم تسجيله");
            if (user.EmailConfirmed == false) return BadRequest("قم بتأكيد بريدك الإلكتروني اولاً");

            try
            {
                if(await SendForgetUsernameOrPasswordAsync(user))
                {
                    return Ok(new JsonResult(new { title = "تم إرسال نسيت أسم المستخدم و كلمة السر", message = "قم بتأكيد بريدك الإلكتروني" }));
                }
                return BadRequest("Invalid EMail");
            }
            catch (System.Exception)
            {
                return BadRequest("Invalid EMail");
            }
        }
        [HttpPut("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.email);
            if (user == null) return Unauthorized("هذا البريد الإلكتروني لم يتم تسجيله");
            if (user.EmailConfirmed == false) return BadRequest("قم بتأكيد بريدك الإلكتروني اولاً");
            try
            {
                var decodedTokenBytes = WebEncoders.Base64UrlDecode(model.token);
                var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

                var result = await _userManager.ResetPasswordAsync(user, decodedToken,model.newPassword);
                if (result.Succeeded)
                {
                    return Ok(new JsonResult(new { title = "تغير كلمة السر", message = "تم تغير كلمة السر بنجاح" }));
                }
                return BadRequest("Invalid Token");
            }
            catch (System.Exception)
            {
                return BadRequest("Invalid Token");
            }
        }

        [HttpPost("add-role/{role:alpha}")]
        public async Task<IActionResult> AddRole(string role)
        {
            if (!await _roleManager.RoleExistsAsync(role))
            {
                var result = await _roleManager.CreateAsync(new IdentityRole(role));
                if (result.Succeeded)
                {
                    return Ok(new { meesage = "Role Created" });
                }
                return BadRequest(result.Errors);
            }
            return BadRequest("Role is exist");
        }

        #region Privat Helper Method
        private UserDto CreateApplicationUserDto(User user)
        {
            return new UserDto
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Role = user.UserRole,
                JWT = _jWTService.JWTCreating(user)
            };
        }

        private async Task<bool> CheckEmailExitAsync(string email)
        {
            return await _userManager.Users.AnyAsync(x => x.Email == email.ToLower());
        }

        private async Task<bool> SendConfirmEmailAsync(User user)
        {
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ConfirmEmailPath"]}?token={token}&email={user.Email}";


            var body = $"<p style=\"font-size: 20px; font-family: 'Times New Roman', Times, serif;\"><span style=\"color: rgb(152, 0, 0);\">{user.FirstName} {user.LastName}</span> : مرحباً</p>" +
                "<p style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\">قم بتأكيد بريدك الإلكتروني عن طريق الرابط التالي </p>" +
                $"<p  style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\"><a href=\"{url}\"> أضغط هنا </a></p>" +
                "<p  style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\">شكرا لوقتك</p>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "تأكيد البريد الإلكتروني", body);

            return await _emailService.SendEmailAsync(emailSend);
        }

        private async Task<bool> SendForgetUsernameOrPasswordAsync(User user)
        {
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var url = $"{_config["JWT:ClientUrl"]}/{_config["Email:ResetPassword"]}?token={token}&email={user.Email}";

            var body = 
                $"<p style=\"font-size: 20px; font-family: 'Times New Roman', Times, serif;\"><span style=\"color: rgb(152, 0, 0);\">{user.FirstName} {user.LastName}</span> : مرحباً</p>" +
                $"<p style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\">{user.UserName} : بريدك الإلكتروني</p>" +
                $"<p style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\">أضغط على الرابط التالي لتغير كلمة السر</p>" +
                $"<p  style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\"><a href=\"{url}\"> أضغط هنا </a></p>" +
                "<p  style=\"font-size: 15px; font-family: 'Times New Roman', Times, serif;\">شكرا لوقتك</p>" +
                $"<br>{_config["Email:ApplicationName"]}";

            var emailSend = new EmailSendDto(user.Email, "نسيت أسم المستخدم أو كلمة السر", body);

            return await _emailService.SendEmailAsync(emailSend);
        }
        #endregion
    }
}