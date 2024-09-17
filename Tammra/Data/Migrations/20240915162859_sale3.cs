using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tammra.Data.Migrations
{
    /// <inheritdoc />
    public partial class sale3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "PriceAfterSale",
                table: "Products",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PriceAfterSale",
                table: "Products");
        }
    }
}
