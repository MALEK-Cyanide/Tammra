namespace Tammra.DTOs.Product
{
    public class ProductDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public double Quantity { get; set; }
        public string ProdImagePath { get; set; }
        public double PriceAfterSale { get; set; }
    }
}
