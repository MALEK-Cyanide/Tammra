import { Component } from '@angular/core';
import { EditProduct } from '../../shared/models/Product/EditProduct';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { AccountService } from '../../account/account.service';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule,
    ValidationMessagesComponent, FormsModule],
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent {
  productForm: FormGroup;
  product: EditProduct | undefined;
  selectedFile: File | null = null;
  salePrice? : boolean = false ;


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private accountservice: AccountService
  ) {
    this.productForm = this.fb.group({
      productId: ['', [Validators.required]],
      email: [this.getEmail(), [Validators.required]],
      productName: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      productionPrice: ['', [Validators.required, Validators.min(0)]],
      isOnSale: ['', [Validators.required, Validators.min(0)]],
      salePrice: ['', [Validators.required, Validators.min(0)]],
      priceAfterSale: ['', [Validators.required, Validators.min(0)]]

    });
  }

  ngOnInit(): void {
    this.getProduct();
  }
  getEmail() {
    return this.accountservice.getJWT().email
  }

  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => {
      this.product = product;
      this.productForm.patchValue({
        productId: product.productId,
        productName: product.productName,
        prodImagePath: product.prodImagePath,
        price: product.price,
        quantity: product.quantity,
        productionPrice: product.productionPrice,
        isOnSale: product.isOnSale,
        salePrice: product.salePrice,
        priceAfterSale: product.priceAfterSale
      });
      this.salePrice = product.isOnSale
    });
  }
  sale(){
    if(this.salePrice == true)
      this.salePrice = false
    else
      this.salePrice = true

  }
  onSubmit(): void {
    const formData = new FormData();

    formData.append('product', JSON.stringify(this.productForm.value));

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
    if (this.product != undefined) {
      formData.append('id', this.product?.productId.toString());
    }

    this.http.put(`${environment.appUrl}/api/product/edit-product`, formData)
      .subscribe(response => {
        Swal.fire("", "تم تعديل منتجك بنجاح", "info");
        this.router.navigateByUrl("/vendor/all-product")
      });
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
}
