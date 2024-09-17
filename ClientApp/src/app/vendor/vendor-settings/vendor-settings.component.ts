import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { VendorService } from '../vendor.service';
import { HttpClient } from '@angular/common/http';
import { VendorInfo } from '../VendorInfo';
import { CommonModule } from '@angular/common';
import { LocationDto } from '../LocationDto';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-vendor-settings',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    FormsModule, GoogleMapsModule],
  templateUrl: './vendor-settings.component.html',
  styleUrl: './vendor-settings.component.css'
})
export class VendorSettingsComponent implements OnInit {
  updateMessage: string = '';
  user: VendorInfo | undefined
  EditInfoForm: FormGroup;
  SelectedProfile: File | null = null;
  selectedCover: File | null = null;
  imgProfilePath: string = "";
  imgCoverPath: string = "";
  url = environment.appUrl

  center: google.maps.LatLngLiteral = { lat: 25.443119600082795, lng: 30.545897483825684 };
  zoom = 17;
  latitude: number | undefined;
  longitude: number | undefined;
  location: any;



  constructor(private vendorService: VendorService, private route: ActivatedRoute, public formBuilder: FormBuilder
    , private http: HttpClient, private accountServices: AccountService, private rout: Router
  ) {
    this.EditInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(12)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    })
  }


  ngOnInit() {
    this.getVendorInfo();
    this.http.get(`${environment.appUrl}/api/VendorAccount/get-location/${this.accountServices.getJWT().email}`)
      .subscribe((data: any) => {
        this.center = { lat: data.latitude, lng: data.longitude };
      });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.latitude = event.latLng.lat();
      this.longitude = event.latLng.lng();
      this.center = {
        lat: this.latitude,
        lng: this.longitude
      };
    }
  }

  saveLocation() {
    this.location = {
      email: this.accountServices.getJWT().email,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.http.post<LocationDto>(`${environment.appUrl}/api/VendorAccount/save-location`, this.location)
      .subscribe(response => {
        console.log('Location saved', response);
      });
  }

  getVendorInfo() {
    this.vendorService.getUser(this.accountServices.getJWT().email).subscribe((user: VendorInfo) => {
      this.user = user;
      this.EditInfoForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        description: user.description,
        companyName: user.companyName,
      })
      this.imgProfilePath = user.vendorImagePath;
      this.imgCoverPath = user.vendorCoverPath;

    })
  }

  onSubmit(): void {
    this.location = {
      email: this.accountServices.getJWT().email,
      latitude: this.latitude,
      longitude: this.longitude
    };

    this.http.post<LocationDto>(`${environment.appUrl}/api/VendorAccount/save-location`, this.location)
      .subscribe(response => {
      });

    const formData = new FormData();

    formData.append('email', this.accountServices.getJWT().email);

    formData.append('vendor', JSON.stringify(this.EditInfoForm.value));

    if (this.SelectedProfile) {
      formData.append('imageProfile', this.SelectedProfile);
    } if (this.selectedCover) {
      formData.append('imageCover', this.selectedCover);
    }

    this.http.put(`${environment.appUrl}/api/VendorAccount/update-settings`, formData)
      .subscribe(response => {
        console.log(response)
        Swal.fire("", "تم تغير بياناتك بنجاح", "success");
        this.rout.navigateByUrl("/vendor")

      });
  }


  onFileSelectedProfile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.SelectedProfile = file;
    }
  }
  onFileSelectedCover(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedCover = file;
    }
  }
}
