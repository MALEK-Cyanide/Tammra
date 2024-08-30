import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ValidationMessagesComponent } from './components/errors/validation-messages/validation-messages.component';
import { NotificationComponent } from './components/modals/notification/notification.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule
    ,HttpClientModule,
    ValidationMessagesComponent
    ,NotificationComponent
  ],
  exports:[RouterModule ,
    ReactiveFormsModule,
    HttpClientModule,
    ValidationMessagesComponent,
    NotificationComponent
  ]
})
export class SharedModule { }
