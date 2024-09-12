import { Component, OnInit } from '@angular/core';
import { AllProductComponent } from "./all-product/all-product.component";
import { AddProductComponent } from "./add-product/add-product.component";
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account/account.service';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { VendorInfoComponent } from '../vendor/vendor-info/vendor-info.component';
import { VendorService } from '../vendor/vendor.service';
import { VendorInfo } from '../vendor/VendorInfo';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [AllProductComponent, AddProductComponent, RouterModule, CommonModule, GoogleMapsModule, VendorInfoComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  isSidebarOpen = true;
  companyName: string = "";
  description: string = "";
  profilePath: string = "";
  coverPath: string = "";
  url = environment.appUrl
  isVendorOrAdmin = true
  center = { lat: 25.443119600082795, lng: 30.545897483825684 };
  zoom = 12;
  latitude: number | null = null;
  longitude: number | null = null;


  constructor(private vendorService: VendorService, private accountServices: AccountService, private rout: Router, private http: HttpClient) { }

  ngOnInit(): void {
    this.getVendorData()
  }

  getVendorData() {
    this.vendorService.getUser(this.accountServices.getJWT().email).subscribe((user: VendorInfo) => {
      this.companyName = user.companyName
      this.description = user.description
      this.profilePath = user.vendorImagePath
      this.coverPath = user.vendorCoverPath
    })
  }

  onMapClick(event: any) {
    this.latitude = event.latLng.lat();
    this.longitude = event.latLng.lng();
  }
  saveLocation() {
    const locationData = {
      email : this.accountServices.getJWT().email,
      latitude: this.latitude,
      longitude: this.longitude,
    };

    this.http.post(`${environment.appUrl}/api/VendorAccount/location`, locationData)
      .subscribe(response => {
        alert('Location saved successfully!');
      });
  }
  

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}