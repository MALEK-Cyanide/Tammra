using System.ComponentModel.DataAnnotations;

namespace Tammra.Models
{
    public class Coupon
    {
        [Key]
        public int CouponID { get; set; }
        public string CouponName { get; set; }
        public double CouponValue { get; set; }
        public int Quantity { get; set; }
    }
}
