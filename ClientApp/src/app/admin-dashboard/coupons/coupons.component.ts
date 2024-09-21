import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Coupon } from './Coupon';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-coupons',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , RouterModule],
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.css'
})
export class CouponsComponent implements OnInit {

  couponForm: FormGroup = new FormGroup({});
  coupons: Coupon[] = [];
  showFormAdd: boolean = false;
  showFormEdit: boolean = false;
  isEdit: boolean = false;
  currentCouponIndex: number = -1;

  constructor(private fb: FormBuilder, private http: HttpClient) {

  }
  ngOnInit(): void {
    this.form()
    this.getCoupons()
  }

  getCoupons() {
    this.http.get<Coupon[]>(`${environment.appUrl}/api/admin/get-coupon`).subscribe((co: Coupon[]) => {
      this.coupons = co
    })
  }
  form() {
    this.couponForm = this.fb.group({
      couponId: ['', Validators.required],
      couponName: ['', Validators.required],
      couponValue: ['', Validators.required],
      quantity: ['', Validators.required],
    });
  }
  onSubmitEdit() {
    const co = new FormData();
    co.append('coupon', JSON.stringify(this.couponForm.value))
    this.http.put(`${environment.appUrl}/api/admin/edit-coupon`, co).subscribe((res) => {
      Swal.fire("", "تم تعديل كوبون خصم", "success")
      window.location.reload()
    })
    this.resetForm();
  }

  editCoupon(coupon: Coupon) {
    this.showFormAdd = false;
    this.showFormEdit = true;
    this.couponForm.patchValue({
      couponId: coupon.couponID,
      couponName: coupon.couponName,
      couponValue: coupon.couponValue,
      quantity: coupon.quantity,
    });
  }

  deleteCoupon(index: number) {
    this.http.delete(`${environment.appUrl}/api/admin/delete-coupon/${index}`).subscribe((res) => {
      Swal.fire("", "تم إزالة كود الخصم بنجاح", "success")
      window.location.reload()
    })
  }

  resetForm() {
    this.showFormAdd = false;
    this.showFormEdit = false;
    this.isEdit = false;
    this.couponForm.reset();
  }
}

