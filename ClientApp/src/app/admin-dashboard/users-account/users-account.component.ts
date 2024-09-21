import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { VendorInfo } from '../../vendor/VendorInfo';
import Swal from 'sweetalert2';
import { VendorService } from '../../vendor/vendor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './users-account.component.html',
  styleUrl: './users-account.component.css'
})
export class UsersAccountComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  users: VendorInfo[] = [];
  showForm: boolean = false;
  isEdit: boolean = false;
  searchQuery: string = "";
  Type: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient, private vendorService: VendorService , private router : Router) { }
  ngOnInit(): void {
    this.form()
    this.getAllUser()
    this.vendorService.searchResults$.subscribe((results) => {
      this.users = results;
    });
  }

  form() {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userRole: ['', [Validators.required]],
    });
  }
  getAllUser() {
    this.http.get<VendorInfo[]>(`${environment.appUrl}/api/admin/all-user`).subscribe((users: VendorInfo[]) => {
      this.users = users
      this.Type = false
    })
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formdata = new FormData();
      formdata.append('user', JSON.stringify(this.userForm.value));
      this.http.put(`${environment.appUrl}/api/admin/change-info`, formdata).subscribe((res) => {
        window.location.reload()
      })
      this.showForm = false;
      this.userForm.reset();
      Swal.fire("", "تم تغير بيانات المستخدم بنجاح", "success")
    }
  }

  editUser(user: VendorInfo) {
    this.showForm = true;
    this.isEdit = true;

    this.userForm.patchValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userRole: user.userRole
    });
  }

  blockUser(index: string) {
    const formdata = new FormData();
    formdata.append('email', index);
    this.http.put(`${environment.appUrl}/api/admin/block-user`, formdata).subscribe((res) => {
      window.location.reload()
      // this.router.navigateByUrl("/admin/users")
    })
  }

  cancelEdit() {
    this.showForm = false;
    this.userForm.reset();
  }
  isUser() {
    this.Type = true;
    if (this.searchQuery.trim()) {
      this.vendorService.searchUser(this.searchQuery).subscribe((results) => {
        this.vendorService.updateSearchResults(results);
      });
    }
  }
}