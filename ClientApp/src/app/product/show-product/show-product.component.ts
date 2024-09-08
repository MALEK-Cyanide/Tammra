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
  imageUrl: any;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute, private http: HttpClient,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.getImg(id)
    this.productService.getProduct(id).subscribe((product) => (this.product = product));
  }
  // loadImage(id: number) {
  //   console.log(id)
  //   this.productService.getImage(id).subscribe((imageBlob) => {
  //     const objectURL = URL.createObjectURL(imageBlob);
  //     this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  //   });
  // }
  getImg(id: number) {
    this.http.get(`${environment.appUrl}/api/product/getImage/${id}`)
      .subscribe(response => {
        this.imageUrl = response;
        console.log(this.imageUrl)
      });
  }
}
