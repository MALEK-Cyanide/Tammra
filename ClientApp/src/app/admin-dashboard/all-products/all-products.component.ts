import { Component, OnInit } from '@angular/core';
import { GetAllProducts } from '../../shared/models/Product/GetAllProducts';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../account/account.service';
import { ProductService } from '../../product/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule , RouterModule , FormsModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent implements OnInit {
  products: GetAllProducts[] = [];
  url = environment.appUrl
  searchQuery: string = '';
  load = false;
  show = false

  
  constructor(private productService: ProductService , private accountService : AccountService) { }

  ngOnInit(): void {
    this.getAllProd()
    this.productService.searchResults$.subscribe((results) => {
      this.products = results;
    });
  }
  getAllProd(){
    this.productService.getAllProductsForAdmin(this.accountService.getJWT().email).subscribe
    ((data: GetAllProducts[]) => {
      this.products = data;
    });
    this.show = false
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
