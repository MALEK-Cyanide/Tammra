import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductRoutingModule } from './product-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ProductRoutingModule,
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  exports:[
    RouterModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
