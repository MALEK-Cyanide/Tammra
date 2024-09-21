import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VendorInfo } from './VendorInfo';
import { AccountService } from '../account/account.service';
import { environment } from '../../environments/environment.development';
import { LocationDto } from './LocationDto';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../admin-dashboard/show-orders/Order';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private searchResultsSource = new BehaviorSubject<any[]>([]);
  searchResults$ = this.searchResultsSource.asObservable();
  selectedUser: VendorInfo | undefined
  private vendorData: VendorInfo | undefined;

  constructor(private http: HttpClient, private accoubtService: AccountService
    , @Inject(PLATFORM_ID) private platformId: Object , private router : Router
  ) { }

  getUser(email: string): Observable<VendorInfo> {
    return this.http.get<VendorInfo>(`${environment.appUrl}/api/VendorAccount/vendor-data/${email}`);
  }

  updateUser(user: VendorInfo): Observable<VendorInfo> {
    return this.http.post<VendorInfo>(`${environment.appUrl}/api/VendorAccount/update-settings`, user);
  }
  searchVendor(query: string): Observable<VendorInfo[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<VendorInfo[]>(`${environment.appUrl}/api/VendorAccount/search-vendor/`, { params });
  }
  searchOrder(query: string): Observable<Order[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<Order[]>(`${environment.appUrl}/api/admin/search-order/`, { params });
  }
  updateSearchResults(results: any[]) {
    this.searchResultsSource.next(results);
  }

  setSelectedUser(user: VendorInfo | undefined): void {
    this.selectedUser = user;

    if (user) {
      const now = new Date().getTime();
      const vendorDataWithExpiry = {
        value: user,
        expiry: now + 5 * 600 * 1000
      };

      localStorage.setItem('vendorData', JSON.stringify(vendorDataWithExpiry));
    } else {
      localStorage.removeItem('vendorData');
    }
  }
  getVendorData() {
    if (this.vendorData) {
      return this.vendorData;
    }

    if (isPlatformBrowser(this.platformId)) {
      const savedDataStr = localStorage.getItem('vendorData');

      if (!savedDataStr) {
        return null;
      }

      const savedData = JSON.parse(savedDataStr);
      const now = new Date().getTime();

      if (now > savedData.expiry) {
        localStorage.removeItem('vendorData');
        this.router.navigateByUrl("/search")
        return null;
      }

      return savedData.value;
    }

    return null;
  }
  saveLocation(vemdorLocation: LocationDto | undefined): Observable<LocationDto> {
    return this.http.post<LocationDto>(`${environment.appUrl}/api/VendorAccount/location/`, vemdorLocation);
  }
}
