import { Component, OnInit } from '@angular/core';
import { ProductService } from '../product.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';
import { Router } from '@angular/router';
import { AccountService } from '../../account/account.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    ValidationMessagesComponent, FormsModule,],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  AddProductForm: FormGroup = new FormGroup({});
  selectedFile: File | null = null;
  imagePath: string | null = null;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedRating: number = 0



  constructor(public productService: ProductService,
    public accountservice: AccountService,
    public formBuilder: FormBuilder
    , public router: Router
    , private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.AddProductForm = this.formBuilder.group({
      email: [this.getEmail(), [Validators.required]],
      productName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      quantity: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      price: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      productionPrice: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }
  rate(rating: number) {
    this.selectedRating = rating;
  }
  getImagePath() {
    return this.imagePath
  }
  onSubmit(): void {
    const formData = new FormData();

    formData.append('product', JSON.stringify(this.AddProductForm.value));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
if(this.selectedRating){
  formData.append('rate', this.selectedRating.toString());
}

    this.http.post(`${environment.appUrl}/api/product/add-product`, formData)
      .subscribe(response => {
        Swal.fire("", "تم إضافة منتجك بنجاح", "success");
        this.router.navigateByUrl("/vendor/all-product")
      });
  }
  getEmail() {
    return this.accountservice.getJWT().email
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}