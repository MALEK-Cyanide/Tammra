using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tammra.Data.Migrations
{
    /// <inheritdoc />
    public partial class order3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OrderNum",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OrderNum",
                table: "Oreders");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Oreders");
        }
    }
}
