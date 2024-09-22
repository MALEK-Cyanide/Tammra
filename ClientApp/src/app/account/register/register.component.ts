import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account.service';
import { ValidationMessagesComponent } from "../../shared/components/errors/validation-messages/validation-messages.component";
import { Router, RouterModule } from '@angular/router';
import { User } from '../../shared/models/account/User';
import { take } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule, RouterModule,
    ValidationMessagesComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: { error: string }[] = [];
  isVendor = true;
  Vendor: any;
  Customer: any;
  activeButton: string = '';

  getVendor() {
    this.isVendor = true;
    this.Vendor = "Vendor"
  }
  getCustomer() {
    this.isVendor = false;
    this.Customer = "Customer"
  }
  setActive(button: string) {
    this.activeButton = button;
  }

  constructor(public accountService: AccountService,
    public formBuilder: FormBuilder
    , public router: Router) {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          router.navigateByUrl("/");
        }
      }
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      role: ['', [Validators.required]],
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }
  register() {
    this.submitted = true;
    this.errorMessages = [];
    if (this.registerForm.valid) {
      this.accountService.register(this.registerForm.value).subscribe({
        next: (response: any) => {
          Swal.fire("", " تم إرسال رسالة تأكيد الى بريدك الإلكتروني", "success")
          this.router.navigateByUrl("/account/login");
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessages = error.error.errors
          }
          else {
            this.errorMessages.push(error.error);
          }
        }
      });
    };
  }
}
export function confirmPasswordValidator(controlName: string, matchingControlName: string) {
  return (control: AbstractControl) => {
    const matchingControl = control.root.get(matchingControlName);
    if (!matchingControl || !control.value || control.value !== matchingControl.value) {
      return { confirmPasswordMismatch: true };
    }
    return null;
  };
}