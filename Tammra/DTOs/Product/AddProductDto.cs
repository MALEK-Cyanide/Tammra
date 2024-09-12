using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations;

namespace Tammra.DTOs.Product
{
    public class AddProductDto
    {
        public string ProductName { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public double Profit { get; set; }
        public string ProdImagePath { get; set; }
        public double ProductionPrice { get; set; }
        [DataType(DataType.Date)]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:yyyy-MM-dd}")]
        public DateTime DateAdded { get; set; } = DateTime.UtcNow;
        public string UserId { get; set; }
        public string Email { get; set; }
        public IFormFile ImgPath { get; set; }

    }
}
