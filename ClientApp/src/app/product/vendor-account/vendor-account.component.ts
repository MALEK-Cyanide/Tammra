import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VendorService } from './vendor.service';
import Swal from 'sweetalert2';
import { VendorInfo } from './VendorInfo';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-vendor-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    FormsModule],
  templateUrl: './vendor-account.component.html',
  styleUrl: './vendor-account.component.css'
})
export class VendorAccountComponent implements OnInit {
  updateMessage: string = '';
  user : VendorInfo | undefined
  EditInfoForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imagePath: string | null = null;


  constructor(private vendorService: VendorService, private route: ActivatedRoute, public formBuilder: FormBuilder
    , private http: HttpClient , private accountServices : AccountService
  ) { }

  ngOnInit() {
    this.initializeForm();
    this.vendorService.getUserByEmail(this.accountServices.getJWT().email).subscribe(data => {
      this.user = Object(data);
    });
  }
  initializeForm() {
    this.EditInfoForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      phoneNumber: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      description: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      companyName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      vendorCoverPath: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      vendorImagePath: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }

  // Method to handle form submission
  onSubmit() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post<{ filePath: string }>(`${environment.appUrl}/api/product/uplaod-image`, formData)
        .subscribe(response => {
          this.imagePath = response.filePath;
        });
    }
    this.vendorService.updateUser(this.accountServices.getJWT().email, this.EditInfoForm.value).subscribe(response => {
      Swal.fire("", "تم تعديل بياناتك بنجاح", "success");
    });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
