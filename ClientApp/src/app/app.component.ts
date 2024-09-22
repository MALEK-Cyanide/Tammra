import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Routes } from '@angular/router';
import { NavbarComponent } from "./navbar/navbar.component";
import { HomeComponent } from './home/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AccountService } from './account/account.service';
import { jwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { FooterComponent } from './LastFooter/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,
    NavbarComponent,
    RouterModule,
    HomeComponent,
    FooterComponent
  ]
  , providers: [{
    provide: HTTP_INTERCEPTORS, useClass: jwtInterceptor, multi: true
  }
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(public accountService: AccountService) {

  }

  ngOnInit(): void {
    this.accountService.refreashUser();
  }
  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // لجعل التمرير سلساً
    });
  }
}