using System.Collections.Generic;
using System;
using Tammra.Models;
using Microsoft.AspNetCore.Http;

namespace Tammra.DTOs.Vendor
{
    public class VendorDto
    {
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhoneNumber { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public IFormFile VendorImagePath { get; set; }
        public IFormFile VendorCoverPath { get; set; }
        public string Navigation { get; set; }
        public string Description { get; set; }

    }
}
