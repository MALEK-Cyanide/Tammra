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
import { CartService } from '../payment/cart/cart.service';
import { AccountService } from '../account/account.service';
import Swal from 'sweetalert2';

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
  Type : any;
  url = environment.appUrl
  user: VendorInfo | undefined
  quantity = 1;
empty: any;

  constructor(private productService: ProductService, private vendorService: VendorService, private route: Router
    ,private cartService: CartService , private accountService: AccountService  ) { }
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
  addToCart(productId: number): void {
    this.cartService.addToCart(productId, this.accountService.getJWT().email, this.quantity).subscribe(() => {
      Swal.fire("", "تم إضافة طلبك إلى عربة المشتريات", "success")
    });
  }

  isProduct() {
    this.Type = true;
    if (this.searchQuery.length > 0) {
      if (this.searchQuery.trim()) {
        this.productService.searchProducts(this.searchQuery).subscribe((results) => {
          this.load = false
          this.productService.updateSearchResults(results);
        });
        this.empty = true
      }
    }
  }

  isVendor() {
    this.Type = false;
    if (this.searchQuery.trim()) {
      this.vendorService.searchVendor(this.searchQuery).subscribe((results) => {
        this.load = false
        this.vendorService.updateSearchResults(results);
      });
      this.empty = true
    }
  }
}
