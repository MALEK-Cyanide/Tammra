import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../account/account.service';
import { CartDto } from './CartDto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  getCart(email: string): Observable<CartDto[]> {
    return this.http.get<CartDto[]>(`${environment.appUrl}/api/cart/get-cart/${email}`);
  }

  addToCart(productId: number, email: string, quantity: number): Observable<any> {
    const formData = new FormData();

    formData.append('productID', productId.toString());

    formData.append('email', email);

    formData.append('quantity', quantity.toString());

    return this.http.post(`${environment.appUrl}/api/cart/add-to-cart`, formData);
  }

  checkout(email: string): Observable<any> {
    return this.http.post<any>(`${environment.appUrl}/api/Order/checkout/${email}`, {});
  }
  deleteItem(id: number) {
    return this.http.delete(`${environment.appUrl}/api/cart/delete-cart/${id}`);
  }
  changQ(id: number, quantity: number) {
    const formData = new FormData();

    formData.append('id', id.toString());

    formData.append('quntity', quantity.toString());

    return this.http.put(`${environment.appUrl}/api/cart/change-amount`, formData)
  }
  SendTotolPrice(total: any, email: string) {
    const formData = new FormData();
    formData.append('total', total.toString());
    formData.append('email', email); 
  
    // Send formData to API endpoint
    return this.http.post(`${environment.appUrl}/api/payment/total-cart-price`, formData);
  }
  downloadOrderPdf(email: string) {
    return this.http.get(`${environment.appUrl}/api/Order/download-order/${email}`, {
      responseType: 'blob',
    });
  }
}
