import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Order } from './show-orders/Order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  getAllOrders() : Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.appUrl}/api/admin/all-orders`)
  }
  editOrderStatus(editStatus : any){
    const formdata = new FormData();
    formdata.append('orderStatu' , editStatus.toString())
    return this.http.put(`${environment.appUrl}/api/admin/update-status-order` , formdata)
  }
}
