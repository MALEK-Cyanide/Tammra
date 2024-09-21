import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GetAllProducts } from '../../shared/models/Product/GetAllProducts';
import { ProductService } from '../product.service';
import { AccountService } from '../../account/account.service';
import { environment } from '../../../environments/environment.development';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [CommonModule , RouterModule , FormsModule],
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.css'
})
export class AllProductComponent implements OnInit {
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
    this.productService.getAllProducts(this.accountService.getJWT().email).subscribe
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
