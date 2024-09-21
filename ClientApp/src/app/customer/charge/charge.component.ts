import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Order } from '../../admin-dashboard/show-orders/Order';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../account/account.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-charge',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './charge.component.html',
  styleUrl: './charge.component.css'
})
export class ChargeComponent implements OnInit {
  Order?: Order
  stat: number = 0;

  constructor(private http: HttpClient, private account: AccountService, private route: ActivatedRoute,) { }
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Order>(`${environment.appUrl}/api/customer/get-order-info/${id}`).subscribe((order: Order) => {
      this.Order = order
    })
    this.getStat()
  }

  steps = [
    { icon: 'fa-solid fa-list-ul', label: 'الطلب' },
    { icon: 'fa-solid fa-truck-loading', label: 'تم الشحن' },
    { icon: 'fa-solid fa-shipping-fast', label: 'خرج للتوصيل' },
    { icon: 'fa-solid fa-box', label: 'تم التسليم' }
  ];
  currentStep = this.stat

  getStat() {
    if (this.Order?.status == "تم الطلب") {
      this.stat = 0
    }
    else if (this.Order?.status == "تم الشحن") {
      this.stat = 1
    }
    else if (this.Order?.status == "خرج للتوصيل") {
      this.stat = 2
    }
    else if (this.Order?.status == "تم التوصيل") {
      this.stat = 3
    }
  }
}

