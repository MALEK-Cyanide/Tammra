import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    AccountRoutingModule,
    SharedModule,
  ],
  exports: [
    RouterModule,
    AccountRoutingModule,
    SharedModule
  ]
})
export class AccountModule { }
