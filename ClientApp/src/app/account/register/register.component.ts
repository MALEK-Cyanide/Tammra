import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AccountService } from '../account.service';
import { ValidationMessagesComponent } from "../../shared/components/errors/validation-messages/validation-messages.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule,
    HttpClientModule, ValidationMessagesComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup = new FormGroup({});
  submitted = false;
  errorMessages: string[] = [];

  constructor(private accountService : AccountService , 
      private formBuilder :FormBuilder
      ,private router : Router){}
  
  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      lastName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]],
    })
  }
  register(){
    this.submitted = true;
    this.errorMessages = [];
    if(this.registerForm.valid){
      this.accountService.register(this.registerForm.value).subscribe({
      next : (response : any) =>{
        alert("تم إنشاء حسابك بنجاح");
        this.router.navigateByUrl("/account/login");
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