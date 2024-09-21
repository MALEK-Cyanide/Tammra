import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderItem } from './OrderItem';
import { environment } from '../../../environments/environment.development';
import { ProductService } from '../../product/product.service';
import { GetAllProducts } from '../../shared/models/Product/GetAllProducts';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  show = false
  OrderItems : OrderItem[] = []
  product? : GetAllProducts
  url = environment.appUrl
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0
  Done = true
  
  constructor(private http: HttpClient , private route: ActivatedRoute, private productService : ProductService) { }
  ngOnInit(): void {
    this.getOrderDetails()
  }
  getOrderDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<OrderItem[]>(`${environment.appUrl}/api/admin/order-details/${id}`).subscribe((res : OrderItem[]) =>{
      this.OrderItems = res
    })
  }
    Product(id : any){
    this.show = true
    this.productService.getProduct(id).subscribe((product) => {
      this.product = product
    });
  }
  rate(rating: number) {
    this.selectedRating = rating;
  }
  SaveRating(id : number){
    const formData = new FormData();
    if (this.selectedRating) {
      formData.append('rate', this.selectedRating.toString());
    }
    formData.append('id', id.toString());
    this.http.post(`${environment.appUrl}/api/customer/add-rate`, formData)
      .subscribe(response => {
        Swal.fire("", "شكرا علي تقيم المنتج", "success");
      });
      this.Done = false
  }
}
