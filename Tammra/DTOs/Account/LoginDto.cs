using System.ComponentModel.DataAnnotations;

namespace Tammra.DTOs.Account
{
    public class LoginDto
    {
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "البريد غير صحيح")]
        public string Username { get; set; }

        [Required]
        [StringLength(15, MinimumLength = 6, ErrorMessage = "كلمة السر ما بين 2 إلى 15 حرف و رقم")]
        public string Password { get; set; }
    }
}
