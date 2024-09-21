import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../customer/customer.service';
import { AccountService } from '../../account/account.service';
import { Customer } from '../../customer/Customer';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Payment } from '../payment/Payment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-order',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule , CommonModule],
  templateUrl: './confirm-order.component.html',
  styleUrl: './confirm-order.component.css'
})
export class ConfirmOrderComponent implements OnInit {
  PaymentForm: FormGroup = new FormGroup({});
  customer: Customer | undefined
  totalP: any
  phoneNum: any

  constructor(private CustomerServices: CustomerService, private Account: AccountService,
    private formBuilder: FormBuilder, private http: HttpClient,
    private route: Router) {

  }
  ngOnInit(): void {
    this.getCustomer()
    this.getTotolPrice()
    this.initializeForm();
  }
  initializeForm() {
    this.PaymentForm = this.formBuilder.group({
      phoneNumber: ['', [Validators.required]],
      governorate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      street: ['', [Validators.required]],
      addressDetails: [''],
    })
  }
  getCustomer() {
    this.CustomerServices.getCustomer(this.Account.getJWT().email).subscribe((user: Customer) => {
      this.customer = user;
      this.phoneNum = user.phoneNumber
    })
  }
  totalPrice() {
    this.CustomerServices.totalPrice(this.Account.getJWT().email).subscribe((res) => {
      this.totalP = res
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('email', this.Account.getJWT().email)
    formData.append('order', JSON.stringify(this.PaymentForm.value))
    formData.append('totalP', this.totalP)

    return this.http.post<Payment>(`${environment.appUrl}/api/Payment/make-order`, formData).subscribe((res) => {
      console.log(this.PaymentForm)
      if (this.PaymentForm.valid) {
        this.route.navigateByUrl('/payment');
      }
      else{
        Swal.fire("" , "يجب ملئ جميع الحقول بدقة لضمان توصيل طلبك" , "error")
      }
    })
  }
  getTotolPrice(){
    this.http.get<number>(`${environment.appUrl}/api/Payment/get-cart-price/${this.Account.getJWT().email}`).subscribe((res : number)=>{
      this.totalP = res
    })
  }
}
