﻿using System.ComponentModel.DataAnnotations;

namespace Tammra.DTOs.Account
{
    public class ConfirmEmailDto
    {
        [Required]
        public string Token { get; set; }
        [Required]
        [RegularExpression("^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$", ErrorMessage = "البريد غير صحيح")]
        public string Email { get; set; }
    }
}
