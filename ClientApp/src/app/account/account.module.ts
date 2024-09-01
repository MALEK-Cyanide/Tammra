import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    SharedModule,
    HttpClientModule
  ],
  exports: [
    RouterModule,
    AccountRoutingModule,
    SharedModule,
    HttpClientModule
  ]
})
export class AccountModule { }
