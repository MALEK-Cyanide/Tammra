using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Tammra.Data.Migrations
{
    /// <inheritdoc />
    public partial class order2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Address",
                table: "Oreders",
                newName: "Street");

            migrationBuilder.AddColumn<string>(
                name: "AddressDetails",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Governorate",
                table: "Oreders",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AddressDetails",
                table: "Oreders");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Oreders");

            migrationBuilder.DropColumn(
                name: "Governorate",
                table: "Oreders");

            migrationBuilder.RenameColumn(
                name: "Street",
                table: "Oreders",
                newName: "Address");
        }
    }
}
