import { inject, Injectable } from "@angular/core";
import { HttpRequest , HttpHandler , HttpEvent , HttpInterceptor } from "@angular/common/http";
import { Observable, take } from "rxjs";
import { AccountService } from "../../account/account.service";

@Injectable()

export class jwtInterceptor implements HttpInterceptor{
  constructor(private accountService : AccountService){}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.accountService.user$.pipe(take(1)).subscribe({
      next: user =>{
        request = request.clone({
          setHeaders: {
            Authorization: `Beare ${user?.JWT}`
          }
        })
      }
    })
    throw new Error("Method not implemented.");
  }
};
