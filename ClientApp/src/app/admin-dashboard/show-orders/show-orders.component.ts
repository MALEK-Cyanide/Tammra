import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Order } from './Order';
import { AdminService } from '../admin.service';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../product/product.service';
import { VendorService } from '../../vendor/vendor.service';

@Component({
  selector: 'app-show-orders',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule , RouterModule , FormsModule],
  templateUrl: './show-orders.component.html',
  styleUrl: './show-orders.component.css'
})
export class ShowOrdersComponent implements OnInit {
  searchQuery: string = '';
  orderForm: FormGroup = new FormGroup({});
  orders: Order[] = [];
  showForm: boolean = false;
  isEdit: boolean = false;
  currentOrderIndex: number = -1;
  Type = false;
  empty: any;

  constructor(private fb: FormBuilder, private adminService: AdminService, private http: HttpClient 
    , private productService : VendorService
  ) { }
  ngOnInit(): void {
    this.getOrder()
    this.form()
    this.productService.searchResults$.subscribe((results) => {
      this.orders = results;
    });
  }
  form() {
    this.orderForm = this.fb.group({
      orderId: ['', Validators.required],
      orderNum: ['', Validators.required],
      status: ['', Validators.required],
      totalAmount: ['', Validators.required],
      paymentWay: ['', Validators.required],
      orderDate: ['', Validators.required],
    });
  }

  getOrder() {
    this.adminService.getAllOrders().subscribe((order: Order[]) => {
      this.orders = order
    })
  }
  onSubmit() {
    const formdata = new FormData();
    formdata.append('orderStatu', JSON.stringify(this.orderForm.value));
    this.http.put(`${environment.appUrl}/api/admin/update-status-order`, formdata).subscribe((res) => {
      window.location.reload()
    })
    this.showForm = false;
    this.isEdit = false;
    this.orderForm.reset();
    Swal.fire("", "تم تحديث حالة الطلب", "success");

  }

  editOrder(order: Order) {
    this.showForm = true;
    this.orderForm.patchValue({
      orderId: order.orderId,
      orderNum: order.orderNum,
      status: order.status,
      totalAmount: order.totalAmount,
      paymentWay: order.paymentWay,
      orderDate: order.orderDate
    });
  }

  deleteOrder(index: number) {
    const f = new FormData();
    f.append('index', index.toString())
    this.http.put(`${environment.appUrl}/api/admin/delete-order`, f).subscribe((res) => {
      window.location.reload()
    })
    Swal.fire("", "تم إلغاء الطلب", "success");
  }

  cancelEdit() {
    this.showForm = false;
    this.orderForm.reset();
  }
  isSearch() {
    this.Type = true;
    if (this.searchQuery.length > 0) {
      if (this.searchQuery.trim()) {
        this.productService.searchOrder(this.searchQuery).subscribe((results) => {
          this.productService.updateSearchResults(results);
        });
      }
    }
  }
  AllOrders(){
    this.getOrder()
    this.Type = false
  }
}
