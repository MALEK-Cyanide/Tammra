using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tammra.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserRole { get; set; }
        public DateTime DateCreated { get; set; } = DateTime.UtcNow;
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string VendorImagePath { get; set; }
        public string VendorCoverPath { get; set; }
        public string Navigation { get; set; }
        public string Description { get; set; }
        public string CustomerImagePath { get; set; }
        public ICollection<Product> Products { get; set; }
        public ICollection<Oreder> Oreder { get; set; }


    }
}
