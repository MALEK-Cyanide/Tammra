import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Customer } from './Customer';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../account/account.service';
import { environment } from '../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [RouterLink, RouterModule , CommonModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css'
})
export class CustomerComponent implements OnInit {
  isSidebarOpen: boolean = false;
  customer?: Customer
  fullname = ""
  url = `${environment.appUrl}`
  imgProfilePath: string = ""

  constructor(private http: HttpClient, private account: AccountService) { }

  ngOnInit(): void {
    this.getData()
  }

  getData() {
    return this.http.get<Customer>(`${environment.appUrl}/api/customer/customer-data/${this.account.getJWT().email}`).subscribe((customer: Customer) => {
      this.customer = customer
      this.fullname = customer.firstName + " " + customer.lastName
      this.imgProfilePath = customer.customerImagePath
    })
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
