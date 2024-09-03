import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AccountService } from '../../account/account.service';
import { User } from '../models/account/User';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate{
  constructor(private accountService:AccountService
    ,private router:Router) {}
  canActivate(route :ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> {
    return this.accountService.user$.pipe(
      map((user : User | null) =>{
        if(user){
          return true;
        }else{
          this.router.navigate(["account/login"] , {queryParams: {returnUrl : state.url}});
          return false;
        }
      })
    );
    
  }
}