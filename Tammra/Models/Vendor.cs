using Mailjet.Client.Resources;
using Microsoft.AspNetCore.Identity;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tammra.Models
{
    public class Vendor
    {
        [Key]
        public int VendorId { get; set; }
        [Required]
        public string CompanyName { get; set; }
        [Required]
        public string Address { get; set; }
        [Required]
        public string ImagePathInAPI { get; set; }
        [Required]
        public string CoverPathInAPI { get; set; }
        [Required]
        public string Navigation { get; set; }
        [Required]
        public string Description { get; set; }
        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
