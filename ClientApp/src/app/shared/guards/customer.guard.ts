import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AccountService } from '../../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
  constructor(private accountService: AccountService
    , private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.accountService.getJWT().role == "Customer") {
      return true;
    }
    else
      this.router.navigateByUrl("/authentication")
    return false;
  }
}