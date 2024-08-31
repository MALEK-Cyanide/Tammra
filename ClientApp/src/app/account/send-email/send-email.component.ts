import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/User';
import { CommonModule } from '@angular/common';
import { ValidationMessagesComponent } from "../../shared/components/errors/validation-messages/validation-messages.component";

@Component({
  selector: 'app-send-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationMessagesComponent],
  templateUrl: './send-email.component.html',
  styleUrl: './send-email.component.css'
})
export class SendEmailComponent implements OnInit{
  emailForm : FormGroup = new FormGroup({});
  submitted = false;
  mode : string | undefined;
  errorrMessage: string[] = [];
  constructor( public accountService : AccountService
              ,public router : Router
              ,public formBulider : FormBuilder
              ,public activeRouter : ActivatedRoute){}
  ngOnInit(): void {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: (user : User | null) =>{
        if(user){
          this.router.navigateByUrl("/");
        }
        else{
          const mode = this.activeRouter.snapshot.paramMap.get("mode");
          if(mode){
            this.mode = mode;
            this.intialaizeForm();
          }
        }
      }
    })
  }
  intialaizeForm(){
    this.emailForm = this.formBulider.group({
      email: ['', [Validators.required, Validators.pattern('^\\w+@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$')]]
    })
  }
  sendEmail(){
    this.submitted = true;
    this.errorrMessage = []

    if (this.emailForm.valid && this.mode) {
      if(this.mode.includes("resend-email-confirm-link")){
        this.accountService.resendEmailConformationLink(this.emailForm.get("email")?.value).subscribe({
          next: (res : any) => {
            this.router.navigateByUrl("/");
          },
          error:error =>{
            if(error.error.errors){
              this.errorrMessage = error.error.errors
            } else {
              this.errorrMessage.push(error.error);
            }
          }
        })
      }
    }
  }
  cancel(){
    this.router.navigateByUrl("/account/login");
  }
}
