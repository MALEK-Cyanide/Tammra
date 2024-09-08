import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { VendorInfo } from './VendorInfo';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(private http: HttpClient) {}

  getUserByEmail(email: string){
    const params = new HttpParams().set('query', email);
    return this.http.get(`${environment.appUrl}/api/vendor/get-settings`, { params });
  }

  updateUser(email: string | undefined, user: VendorInfo | undefined): Observable<VendorInfo> {
    return this.http.put<VendorInfo>(`${environment.appUrl}/api/vendor/settings/${email}`, user);
  }
}
