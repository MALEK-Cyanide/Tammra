import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Register } from '../shared/models/account/register';
import { environment } from '../../environments/environment.development';
import { Login } from '../shared/models/account/login';
import { User } from '../shared/models/account/User';
import { map, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ConfirmEmail } from '../shared/models/account/ConfirmEmail';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private userSource = new ReplaySubject<User | null>(1);
  user$ = this.userSource.asObservable();

  constructor(private http : HttpClient , private router : Router
              ,@Inject(PLATFORM_ID) private platformId: Object ) { }

  register(module : Register){
    return this.http.post(`${environment.appUrl}/api/Account/Register` , module);
  }

  login(modulee : Login){
    return this.http.post<User>(`${environment.appUrl}/api/Account/Login` , modulee).pipe(
      map((user : User) => {
        if(user){
          this.setUser(user);
        }
      })
    );
  }

  logout(){
    localStorage.removeItem(environment.userKey);
    this.userSource.next(null);
    this.router.navigateByUrl("/");
  }

  refreshUser(jwt : string | null){

    if(jwt === null){
      this.userSource.next(null);
      return of(undefined);
    }

    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + jwt);

    return this.http.get<User>(`${environment.appUrl}/api/Account/refresh-user-token`, {headers}).pipe(
      map((user : User) => {
        if(user){
          this.setUser(user);
        }
      })
    )
  }
  getJWT(){
    if (isPlatformBrowser(this.platformId)) {
      const key = localStorage.getItem(environment.userKey);
      if(key != null){
        return JSON.parse(key);
      }
    }
}
  private setUser(user : User){
    localStorage.setItem(environment.userKey , JSON.stringify(user));
    this.userSource.next(user);
  }
  getFname(){
    if (isPlatformBrowser(this.platformId)) {
      const localUser = localStorage.getItem(environment.userKey);
      if(localUser != null){
        return JSON.parse(localUser);
    }
  }
}
 refreashUser(){
  const jwt = this.getJWT()?.jwt;
  if(jwt){
    this.refreshUser(jwt).subscribe({
      next: _ =>{},
      error: err =>{
        this.logout();
      }
    })
  }
  else{
    this.refreshUser(null).subscribe();
    }
  }
  confirmEmail(model : ConfirmEmail){
    return this.http.put(`${environment.appUrl}/api/Account/confirm-email` , model)
  }
  resendEmailConformationLink(email : string){
    return this.http.post(`${environment.appUrl}/api/Account/resend-email-confirm-link/${email}` , {});
  }
}
