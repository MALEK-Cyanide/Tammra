using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tammra.Data.Migrations
{
    /// <inheritdoc />
    public partial class PaymentWa : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PaymentWay",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PaymentWay",
                table: "Oreders");
        }
    }
}