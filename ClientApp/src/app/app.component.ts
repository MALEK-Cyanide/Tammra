import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet ,Routes} from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { RegisterComponent } from './account/register/register.component';
import { LoginComponent } from './account/login/login.component';
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountService } from './account/account.service';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { FooterComponent } from './new footer/footer.component';
import { ContactComponent } from './contact/contact.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    NavbarComponent,
    RouterModule,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    FooterComponent,
    ContactComponent
],providers:[{
  provide: HTTP_INTERCEPTORS, useClass : jwtInterceptor , multi : true
}
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  constructor(public accountService : AccountService){
    
  }

  ngOnInit(): void {
    this.accountService.refreashUser();
  }
}