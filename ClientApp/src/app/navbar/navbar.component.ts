import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RegisterComponent } from '../account/register/register.component';
import { LoginComponent } from '../account/login/login.component';
import { HomeComponent } from '../home/home.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { AccountService } from '../account/account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterModule,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  Fname: any;
  Role : any
  searched = true;
  searchQuery: string = '';
  searchResults: any[] = [];

  constructor(public accoutService: AccountService, private productService: ProductService) { }

  ngOnInit(): void {
    this.Fname = this.accoutService.getFname()?.firstName + " " + this.accoutService.getFname()?.lastName;
    this.Role = this.accoutService.getFname()?.role
  }

  logout() {
    this.accoutService.logout();
  }
  search() {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe((results) => {
        this.searchResults = results;
      });
    }
  }
  sech() {
    this.searched = false
  }
  close(){
    this.searched = true
  }
}