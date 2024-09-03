import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Register } from '../shared/models/account/register';

@Injectable({
  providedIn: 'root'
})
export class PlayService {
  constructor(private http: HttpClient) { }

  // Assuming this endpoint returns user details including roles
  getUser(): Observable<Register> {
    return this.http.get<Register>(`${environment.appUrl}/api/play/get-player`);
  }

}
