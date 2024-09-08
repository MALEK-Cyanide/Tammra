import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule
  ],
  exports: [
    RouterModule,
    AccountRoutingModule
  ]
})
export class AccountModule { }
