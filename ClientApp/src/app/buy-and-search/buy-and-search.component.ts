import { Component, OnInit } from '@angular/core';
import { VendorInfo } from '../vendor/VendorInfo';
import { VendorService } from '../vendor/vendor.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../product/product.service';
import { GetAllProducts } from '../shared/models/Product/GetAllProducts';
import { AccountService } from '../account/account.service';
import { GoogleMap } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { CartService } from '../payment/cart/cart.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-buy-and-search',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleMap, FormsModule],
  templateUrl: './buy-and-search.component.html',
  styleUrl: './buy-and-search.component.css'
})
export class BuyAndSearchComponent implements OnInit {
  vendor: VendorInfo | undefined
  products: GetAllProducts[] = [];
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 16;
  url = environment.appUrl
  email: string = ""
  searchQuery: string = '';
  load = false;
  show = false
  quantity = 1;

  constructor(private vendorService: VendorService,
    private http: HttpClient,
    private productService: ProductService,
    private accountService: AccountService,
    private cartService: CartService) { }

  ngOnInit(): void {
    this.vendor = this.vendorService.getVendorData()
    this.email = this.vendorService.getVendorData().email
    this.getAllProd(this.email)
    this.http.get(`${environment.appUrl}/api/VendorAccount/get-location/${this.email}`)
      .subscribe((data: any) => {
        this.center = { lat: data.latitude, lng: data.longitude };
      });
    this.productService.searchResults$.subscribe((results) => {
      this.products = results;
    });
  }
  addToCart(productId: number): void {
    this.cartService.addToCart(productId, this.accountService.getJWT().email, this.quantity).subscribe(() => {
      Swal.fire("", "تم إضافة طلبك إلى عربة المشتريات", "success")
    });
  }
  getAllProd(email: string) {
    this.productService.getAllProducts(email).subscribe
      ((data: GetAllProducts[]) => {
        this.products = data;
        this.show = false
      });
  }

  searchForProduct() {
    if (this.searchQuery.length > 0) {
      if (this.searchQuery.trim()) {
        this.productService.searchProducts(this.searchQuery).subscribe((results) => {
          this.load = false
          this.productService.updateSearchResults(results);
          this.show = true
        });
      }
    }
  }
}
