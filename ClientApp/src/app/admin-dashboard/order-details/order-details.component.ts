import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderItem } from './OrderItem';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  OrderItems : OrderItem[] = []
  constructor(private http: HttpClient , private route: ActivatedRoute,) { }
  ngOnInit(): void {
    this.getOrderDetails()
  }
  getOrderDetails() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<OrderItem[]>(`${environment.appUrl}/api/admin/order-details/${id}`).subscribe((res : OrderItem[]) =>{
      this.OrderItems = res
    })
  }
}
