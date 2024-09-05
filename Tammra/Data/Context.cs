using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Tammra.Models;

namespace Tammra.Data
{
    public class Context : IdentityDbContext<User>
    {
        public Context(DbContextOptions<Context> options) : base(options)
        {

        }
        public DbSet<Vendor> Vendors { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Oreder> Oreders { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    base.OnModelCreating(modelBuilder);

        //    modelBuilder.Entity<Vendor>()

        //        .HasOne(v => v.User)
        //        .WithOne(u => u.Vendor)
        //        .HasForeignKey<Vendor>(v => v.UserId);

        //    modelBuilder.Entity<Customer>()

        //        .HasOne(v => v.User)
        //        .WithOne(u => u.Customer)
        //        .HasForeignKey<Vendor>(v => v.UserId);
        //}
    }
}
