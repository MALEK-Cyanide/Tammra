using System;
using System.ComponentModel.DataAnnotations;

namespace Tammra.DTOs.Product
{
    public class EditProductDto
    {
        public int ProductId { get; set; }
        public string Email { get; set; }
        public double PriceAfterSale { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double Profit { get; set; }
        public string ProdImagePath { get; set; }
        public double ProductionPrice { get; set; }
        [DataType(DataType.Date)]  // Specify that it's a date
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        public bool IsOnSale { get; set; }
        public double SalePrice { get; set; }
    }
}
