import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/User';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    ValidationMessagesComponent,
    RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];
  returnURL: string | null = null;

  constructor(public accountService: AccountService
    , public formBuilder: FormBuilder
    , public router: Router, public activeRoute: ActivatedRoute) {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user: User | null) => {
        if (user) {
          router.navigateByUrl("/");
        }
        else {
          this.activeRoute.queryParamMap.subscribe({
            next: (prams: any) => {
              if (prams) {
                this.returnURL = prams.get("returnURL");
              }
            }
          })
        }
      },
    })
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      Username: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }
  login() {
    this.submitted = true;
    this.errorMessages = [];
    if (this.loginForm.valid) {
      this.accountService.login(this.loginForm.value).subscribe({
        next: (response: any) => {
          console.log("adofjasfaksfoasfoasfo");
          if (this.returnURL) {
            
            this.router.navigateByUrl(this.returnURL);
          } else {
            console.log(response.value.mess);
            this.router.navigateByUrl("/");
          }
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
  resendEmailConfirmationLink() {
    this.router.navigateByUrl("/account/send-email/resend-email-confirm-link");
  }
}
