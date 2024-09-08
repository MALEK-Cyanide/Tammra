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
      prodImagePath: ['', [Validators.required]],
      quantity: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      price: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
      productionPrice: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }
  getImagePath() {
    return this.imagePath
  }
  onSubmit() {

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post<{ filePath: string }>(`${environment.appUrl}/api/product/uplaod-image`, formData)
        .subscribe(response => {
          this.imagePath = response.filePath;
          this.getImagePath()
        });
    }
    this.productService.addProduct(this.AddProductForm.value).subscribe(response => {
      Swal.fire("" , "تم إضافة منتجك بنجاح" , "success")
      this.router.navigateByUrl("/product/all-product")
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