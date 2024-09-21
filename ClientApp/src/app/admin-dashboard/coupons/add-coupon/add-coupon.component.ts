import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-coupon',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , RouterModule , FormsModule],
  templateUrl: './add-coupon.component.html',
  styleUrl: './add-coupon.component.css'
})
export class AddCouponComponent implements OnInit{
  couponForm: FormGroup = new FormGroup({});

  constructor(private fb: FormBuilder, private http: HttpClient , private router : Router){}
  ngOnInit(): void {
    this.form()
  }

  form() {
    this.couponForm = this.fb.group({
      couponName: ['', Validators.required],
      couponValue: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }
  onSubmitAdd() {
    const co = new FormData();
    co.append('coupon', JSON.stringify(this.couponForm.value))
    this.http.post(`${environment.appUrl}/api/admin/add-coupon`, co).subscribe((res) => {
      Swal.fire("", "تم إضافة كوبون خصم", "success")
      this.router.navigateByUrl("/admin/copon")
    })
  }
}
