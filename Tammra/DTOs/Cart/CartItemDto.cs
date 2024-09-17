namespace Tammra.DTOs.Cart
{
    public class CartItemDto
    {
        public int CartId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public int CartItemId { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public string Image { get; set; }
        public double TotalPrice { get; set; }
        public double PriceAfterSale { get; set; }

    }
}
