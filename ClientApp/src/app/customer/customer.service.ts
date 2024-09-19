import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Customer } from './Customer';
import { Payment } from '../payment/payment/Payment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient) { }

  getCustomer(email: string): Observable<Customer> {
    return this.http.get<Customer>(`${environment.appUrl}/api/customer/customer-data/${email}`)
  }
  totalPrice(email: string) {
    return this.http.get(`${environment.appUrl}/api/Payment/get-total-price/${email}`)
  }
  makeOrder(email : string ,payment: Payment) : Observable<Payment> {
    const formData = new FormData();
    formData.append('email' , email)
    formData.append('order' , JSON.stringify(payment))
    return this.http.post<Payment>(`${environment.appUrl}/api/Payment/make-order`, formData)
  }
  getOrder(email: string){
    return this.http.get<Payment>(`${environment.appUrl}/api/Payment/get-order/${email}`)
  }
}
