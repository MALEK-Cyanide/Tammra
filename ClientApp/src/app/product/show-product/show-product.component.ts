import { Component, OnInit } from '@angular/core';
import { GetAllProducts } from '../../shared/models/Product/GetAllProducts';
import { ProductService } from '../product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-show-product',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './show-product.component.html',
  styleUrl: './show-product.component.css'
})
export class ShowProductComponent implements OnInit {
  product: GetAllProducts | undefined;
  AvgRate : number | undefined
  stars: number[] = [1,2,3,4,5];
  url = environment.appUrl

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute, private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.getProduct();
    this.getRate();
  }

  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => (this.product = product));
  }
  getRate(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getRate(id).subscribe((rate) =>{
      this.AvgRate = rate
    })
  }
}
