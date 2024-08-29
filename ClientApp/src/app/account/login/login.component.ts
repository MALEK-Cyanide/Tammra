import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ValidationMessagesComponent } from '../../shared/components/errors/validation-messages/validation-messages.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    HttpClientModule, ValidationMessagesComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService : AccountService ,private formBuilder :FormBuilder,private router : Router){}

  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm() {
    this.loginForm = this.formBuilder.group({
      Username: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      Password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]]
    })
  }
  login(){
    this.submitted = true;
    this.errorMessages = [];
    if(this.loginForm.valid){
      this.accountService.login(this.loginForm.value).subscribe({
      next : (response : any) =>{
        this.router.navigateByUrl("/account/register");
      },
      error : error =>{
        if(error.error.errors){
          this.errorMessages = error.error.errors
        }
        else{
          this.errorMessages.push(error.error);
        }
      }
    });
    };
  }
}
