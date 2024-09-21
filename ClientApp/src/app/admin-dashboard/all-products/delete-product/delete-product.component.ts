import { Component, OnInit } from '@angular/core';
import { GetAllProducts } from '../../../shared/models/Product/GetAllProducts';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../../product/product.service';
import { environment } from '../../../../environments/environment.development';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-product.component.html',
  styleUrl: './delete-product.component.css'
})
export class DeleteProductComponent implements OnInit {
  product: GetAllProducts | undefined;
  url = environment.appUrl

  constructor(private productService: ProductService, private route: ActivatedRoute, private rout: Router) { }

  ngOnInit(): void {
    this.getProduct();
  }
  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => (this.product = product));
  }
  
  deleteProduct(id: number): void {
    Swal.fire("" , "تم حذف المنتج بنجاح" , "error")
    this.productService.deleteProduct(id).subscribe(() => {
      this.getProduct();
      
      this.rout.navigateByUrl("/admin/all-product")
    });
  }
  cancel() {
    this.rout.navigateByUrl("/admin/all-product")
  }
}
