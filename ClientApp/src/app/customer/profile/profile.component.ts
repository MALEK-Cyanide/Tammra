import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { VendorService } from '../../vendor/vendor.service';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { Customer } from '../Customer';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  SelectedProfile: File | null = null;
  EditInfoForm: FormGroup;
  customer?: Customer
  imgProfilePath: string = "";
  url = `${environment.appUrl}`

  constructor(private vendor: VendorService, public formBuilder: FormBuilder
    , private http: HttpClient, private accountServices: AccountService, private rout: Router) {
    this.EditInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      phoneNumber: ['', [Validators.required, Validators.maxLength(12)]],
      gender: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      birthday: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
    })
  }

  ngOnInit(): void {
    this.getCustomer()
  }
  getCustomer() {
    return this.http.get<Customer>(`${environment.appUrl}/api/customer/customer-data/${this.accountServices.getJWT().email}`).subscribe((customer: Customer) => {
      this.customer = customer;
      this.EditInfoForm.patchValue({
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
        gender: customer.gender,
        birthday: customer.birthday
      })
      this.imgProfilePath = customer.customerImagePath;
    })
  }
  onSubmit() {
    const formData = new FormData();

    formData.append('email', this.accountServices.getJWT().email);

    formData.append('customer', JSON.stringify(this.EditInfoForm.value));

    if (this.SelectedProfile) {
      formData.append('imageProfile', this.SelectedProfile);
    }

    this.http.put(`${environment.appUrl}/api/Customer/update-settings`, formData)
      .subscribe(response => {
        Swal.fire("", "تم تغير بياناتك بنجاح", "success");
        this.rout.navigateByUrl("/customer")
        window.location.reload()
      });
  }

  onFileSelectedProfile(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.SelectedProfile = file;
    }
  }
}
