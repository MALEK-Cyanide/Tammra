import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/User';
import { ValidationMessagesComponent } from "../../shared/components/errors/validation-messages/validation-messages.component";
import { CommonModule } from '@angular/common';
import { RestPassword } from '../../shared/models/account/RestPassword';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rest-password',
  standalone: true,
  imports: [RouterModule, ValidationMessagesComponent
    , CommonModule, ReactiveFormsModule],
  templateUrl: './rest-password.component.html',
  styleUrl: './rest-password.component.css'
})
export class RestPasswordComponent implements OnInit {
  restPasswordForm: FormGroup = new FormGroup({});
  token: any;
  email: any;
  submitted = false;
  errorMessage: string[] = [];

  constructor(public accountService: AccountService
    , public formBuilder: FormBuilder
    , public router: Router, public activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          this.router.navigateByUrl("/");
        } else {
          this.activeRoute.queryParamMap.subscribe({
            next: (params: any) => {
              this.token = params.get("token");
              this.email = params.get("email");
              console.log(params.get("token"))

              if (this.token && this.email) {
                this.intializeForm(this.email);
              }
            }
          })
        }
      }
    })
  }
  intializeForm(userName: string) {
    this.restPasswordForm = this.formBuilder.group({
      email: [{ value: userName, disabled: true }],
      newPassword: ["", [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]

    })
  }

  restPassword() {
    this.submitted = true;
    this.errorMessage = [];

    if (this.restPasswordForm.valid && this.email && this.token) {
      const model: RestPassword = {
        Token: this.token,
        Email: this.email,
        NewPassword: this.restPasswordForm.get("newPassword")?.value
      };
      this.accountService.restPassword(model).subscribe({
        next: (res : any) =>{
          Swal.fire("" , "قم بتسجيل دخولك" , "success")
          this.router.navigateByUrl("/account/login");
        },
        error: error => {
          if (error.error.errors) {
            this.errorMessage = error.error.errors
          }
          else {
            this.errorMessage.push(error.error);
          }
        }
      })
    }
  }
}
