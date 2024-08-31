import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { take } from 'rxjs';
import { User } from '../../shared/models/account/User';
import { ConfirmEmail } from '../../shared/models/account/ConfirmEmail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule , RouterModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  success = true;
  constructor(public accountServices : AccountService,
    public router : Router,
    public activeRouter : ActivatedRoute){}

  ngOnInit(): void {
    this.accountServices.user$.pipe(take(1)).subscribe({
      next: (user : User | null) =>{
        if(user){
          this.router.navigateByUrl("/");
        }
        else{
          this.activeRouter.queryParamMap.subscribe({
            next: (parms : any) => {
                const confirmEmail : ConfirmEmail = {
                  token : parms.get("token"),
                  email : parms.get("email")
                }
                console.log(parms.get("token"));
                console.log(parms.get("email"));
                this.success = true;
                this.accountServices.confirmEmail(confirmEmail).subscribe({
                  next: (res : any) => {
                  },
                  error:err =>{
                  }
                })
            }
          })
        }
      }
    })
  }
  resendEmailConfirmationLink(){
    this.router.navigateByUrl("/account/send-email/resend-email-confirm-link");
  }
}
