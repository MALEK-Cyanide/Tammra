import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayRoutingModule } from './play-routing.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlayRoutingModule,
    RouterModule
  ], exports: [
    PlayRoutingModule
  ]
})
export class PlayModule { }
