import { Component } from '@angular/core';
import { RegisterComponent } from '../account/register/register.component';
import { LoginComponent } from '../account/login/login.component';
import { HomeComponent } from '../home/home.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RegisterComponent,
    LoginComponent,
    HomeComponent,HttpClientModule,SharedModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
