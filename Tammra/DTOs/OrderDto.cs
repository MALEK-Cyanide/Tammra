using System;

namespace Tammra.DTOs
{
    public class OrderDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Governorate { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string AddressDetails { get; set; }
        public string OrderNum { get; set; }
        public string PhoneNumber { get; set; }
        public double TotalAmount { get; set; }
        public string PaymentWay { get; set; }

    }
}
