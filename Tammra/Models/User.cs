using Microsoft.AspNetCore.Identity;
using System;
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
        public virtual Vendor Vendor { get; set; }
        public virtual Customer Customer { get; set; }

    }
}
