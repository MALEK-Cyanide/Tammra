import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RegisterComponent } from '../account/register/register.component';
import { LoginComponent } from '../account/login/login.component';
import { HomeComponent } from '../home/home.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AccountService } from '../account/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    SharedModule,
    CommonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
 Fname : any ;
  constructor(public accoutService : AccountService){ }

  ngOnInit(): void {
    this.Fname = this.accoutService.getFname()?.firstName;
  }

  logout(){
    this.accoutService.logout();
  }
}