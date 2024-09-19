using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tammra.Models
{
    public class Oreder
    {
        [Key]
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Governorate { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string AddressDetails { get; set; }
        public string OrderNum { get; set; }
        public string PhoneNumber { get; set; }

        [ForeignKey("User")]
        public string UserId { get; set; }
        public User User { get; set; }
        public double TotalAmount { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }

        public ICollection<Product> Products { get; set; }
    }
}
