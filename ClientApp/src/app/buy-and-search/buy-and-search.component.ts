import { Component, OnInit } from '@angular/core';
import { VendorInfo } from '../vendor/VendorInfo';
import { VendorService } from '../vendor/vendor.service';
import { environment } from '../../environments/environment.development';
import { AccountService } from '../account/account.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buy-and-search',
  standalone: true,
  imports: [],
  templateUrl: './buy-and-search.component.html',
  styleUrl: './buy-and-search.component.css'
})
export class BuyAndSearchComponent implements OnInit {
  vendor?: VendorInfo
  email?: string | undefined
  local?: string
  url = environment.appUrl

  constructor(private vendorService: VendorService, private http: HttpClient) { }

  ngOnInit(): void {
    this.vendor = this.vendorService.getVendorData()
  }

  getUserInfo(email?: string) {
    return this.http.get<VendorInfo>(`${environment.appUrl}/api/VendorAccount/vendor-data/${email}`).subscribe((user: VendorInfo) => {
      this.vendor = user
    })
  }
}
