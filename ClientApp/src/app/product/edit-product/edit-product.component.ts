import { Component } from '@angular/core';
import { EditProduct } from '../../shared/models/Product/EditProduct';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';
import Swal from 'sweetalert2';

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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      prodImagePath: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      productionPrice: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.getProduct();
  }

  // Fetch the existing product by ID
  getProduct(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getProduct(id).subscribe((product) => {
      this.product = product;
      this.productForm.patchValue({
        productName: product.productName,
        prodImagePath: product.prodImagePath,
        price: product.price,
        quantity: product.quantity,
        productionPrice: product.productionPrice,
      });
    });
  }

  // Submit the form to update the product
  onSubmit(): void {
    if (this.productForm.valid && this.product) {
      const updatedProduct: EditProduct = {
        productId: this.product.productId,
        ...this.productForm.value,
      };
      this.productService.updateProduct(updatedProduct).subscribe(() => {
        Swal.fire("" , "تم تعديل منتجك بنجاح" , "info")
        this.router.navigate(['/vendor/all-product']);
      });
    }
  }
}
