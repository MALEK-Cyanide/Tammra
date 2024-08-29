import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }
  showNotification(isSuccess:boolean , title:string, message:string ){
    isSuccess = true
  }
}
