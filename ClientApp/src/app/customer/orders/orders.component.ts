import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductComponent } from '../../product/product.component';
import { Order } from '../../admin-dashboard/show-orders/Order';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../account/account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ProductComponent, RouterModule , CommonModule , FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  order: Order[] = []
  constructor(private http: HttpClient, private account: AccountService) { }
  ngOnInit(): void {
    this.http.get<Order[]>(`${environment.appUrl}/api/Customer/get-order/${this.account.getJWT().email}`).subscribe((order: Order[]) => {
      this.order = order
    })
  }
}
