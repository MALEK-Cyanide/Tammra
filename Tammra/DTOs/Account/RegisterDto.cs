using System.ComponentModel.DataAnnotations;

namespace Tammra.DTOs.Account
{
    public class RegisterDto
    {
        [Required]
        [StringLength(15 , MinimumLength = 2 , ErrorMessage ="الأسم الأول ما بين حرفين إلى 15 حرف")]
        public string FirstName { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 2, ErrorMessage = "الأسم الأخير ما بين حرفين إلى 15 حرف")]
        public string LastName { get; set; }
        [Required]
            [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage ="البريد غير صحيح")]
        public string Email { get; set; }
        [Required]
        [StringLength(15, MinimumLength = 6, ErrorMessage = "كلمة السر ما بين 2 إلى 15 حرف و رقم")]
        public string Password { get; set; }
    }
}
