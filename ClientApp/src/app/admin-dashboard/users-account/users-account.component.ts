import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { VendorInfo } from '../../vendor/VendorInfo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users-account',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './users-account.component.html',
  styleUrl: './users-account.component.css'
})
export class UsersAccountComponent implements OnInit {
  userForm: FormGroup = new FormGroup({});
  users: VendorInfo[] = [];
  showForm: boolean = false;
  isEdit: boolean = false;
  constructor(private fb: FormBuilder, private http: HttpClient) { }
  ngOnInit(): void {
    this.form()
    this.getAllUser()
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
    })
  }

  cancelEdit() {
    this.showForm = false;
    this.userForm.reset();
  }
}
