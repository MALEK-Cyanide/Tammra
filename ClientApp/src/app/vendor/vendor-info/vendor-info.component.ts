import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VendorService } from '../vendor.service';
import { AccountService } from '../../account/account.service';
import { VendorInfo } from '../VendorInfo';
import { GoogleMap } from '@angular/google-maps';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vendor-info',
  standalone: true,
  imports: [RouterModule, GoogleMap],
  templateUrl: './vendor-info.component.html',
  styleUrl: './vendor-info.component.css'
})
export class VendorInfoComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 40.73061, lng: -73.935242 };
  zoom = 16;
  user: VendorInfo | undefined;

  constructor(private http: HttpClient, private vendorService: VendorService, private account: AccountService) { }

  ngOnInit(): void {
    this.getUserInfo()
    this.http.get(`${environment.appUrl}/api/VendorAccount/get-location/${this.account.getJWT().email}`)
      .subscribe((data: any) => {
        this.center = { lat: data.latitude, lng: data.longitude };
      });
  }
  getUserInfo() {
    this.vendorService.getUser(this.account.getJWT().email).subscribe((user: VendorInfo) => {
      this.user = user
    })
  }
}
