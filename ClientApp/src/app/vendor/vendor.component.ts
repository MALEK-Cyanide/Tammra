import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VendorService } from './vendor.service';
import Swal from 'sweetalert2';
import { VendorInfo } from './VendorInfo';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account/account.service';
import { environment } from '../../environments/environment.development';
import { VendorInfoComponent } from "./vendor-info/vendor-info.component";
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-vendor-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    FormsModule, VendorInfoComponent, GoogleMapsModule, RouterModule],
  templateUrl: './vendor-account.component.html',
  styleUrl: './vendor-account.component.css'
})
export class VendorAccountComponent implements OnInit {
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
      latitude: this.latitude,
      longitude: this.longitude,
    };

    this.http.post(`${environment.appUrl}/api/VendorAccount/location/${this.accountServices.getJWT().email}`, locationData)
      .subscribe(response => {
        alert('Location saved successfully!');
      });
  }


  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}