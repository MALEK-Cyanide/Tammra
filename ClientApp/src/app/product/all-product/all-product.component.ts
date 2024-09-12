import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GetAllProducts } from '../../shared/models/Product/GetAllProducts';
import { ProductService } from '../product.service';
import { AccountService } from '../../account/account.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-all-product',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, AsyncPipe, CommonModule , RouterModule],
  templateUrl: './all-product.component.html',
  styleUrl: './all-product.component.css'
})
export class AllProductComponent implements OnInit {
  products: GetAllProducts[] = [];
  url = environment.appUrl
  
  constructor(private productService: ProductService , private accountService : AccountService) { }

  ngOnInit(): void {
    this.getAllProd()
  }
  getAllProd(){
    this.productService.getAllProducts(this.accountService.getJWT().email).subscribe
    ((data: GetAllProducts[]) => {
      this.products = data;
    });
  }
  
}
