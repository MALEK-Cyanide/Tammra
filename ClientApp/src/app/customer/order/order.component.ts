import { CommonModule } from '@angular/common';
import { Component, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderItem } from '../../admin-dashboard/order-details/OrderItem';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
  orderItem? : OrderItem [] = []
}
