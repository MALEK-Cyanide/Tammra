import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product/product.service';
import { CommonModule } from '@angular/common';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { FormsModule } from '@angular/forms';
import { environment } from '../../environments/environment.development';
import { VendorService } from '../vendor/vendor.service';
import { VendorInfo } from '../vendor/VendorInfo';
import { Router, RouterModule } from '@angular/router';
import { state } from '@angular/animations';
import { BuyAndSearchComponent } from '../buy-and-search/buy-and-search.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnInit {
  searchQuery: string = '';
  searchProducts: GetAllProducts[] = [];
  searchVendors: VendorInfo[] = [];
  load = false;
  Type = true;
  url = environment.appUrl
  user: VendorInfo | undefined

  constructor(private productService: ProductService, private vendorService: VendorService, private route: Router
  ) { }
  ngOnInit(): void {
    this.productService.searchResults$.subscribe((results) => {
      this.searchProducts = results;
    });
    this.vendorService.searchResults$.subscribe((results) => {
      this.searchVendors = results;
    });
  }

  ViewVendorProfile(email: string) {
    this.vendorService.getUser(email).subscribe((res: VendorInfo) => {
      this.user = res
      this.vendorService.setSelectedUser(this.user)
      this.route.navigateByUrl("/Vendor-Profile")
    });
  }

  searchForProduct() {
    if (this.searchQuery.length > 0) {
      if (this.searchQuery.trim()) {
        this.productService.searchProducts(this.searchQuery).subscribe((results) => {
          this.load = false
          this.productService.updateSearchResults(results);
        });
      }
    }

  }

  searchForVendor() {
    if (this.searchQuery.trim()) {
      this.vendorService.searchVendor(this.searchQuery).subscribe((results) => {
        this.load = false
        this.vendorService.updateSearchResults(results);
      });
    }
  }
  isProduct() {
    this.Type = true;
  }

  isVendor() {
    this.Type = false;
  }
}
