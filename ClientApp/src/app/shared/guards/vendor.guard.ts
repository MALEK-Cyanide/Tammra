import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class VendorGuard implements CanActivate {
  constructor(private accountService: AccountService
    , private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if(this.accountService.getJWT().role == "Vendor"){
      return true;
    }
      else
      return false;
  }
  
}