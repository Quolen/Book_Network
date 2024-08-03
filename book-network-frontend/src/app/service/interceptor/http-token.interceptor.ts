import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {inject} from "@angular/core";
import {TokenService} from "../token/token.service";

export const httpTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService: TokenService = inject(TokenService);
  const token = tokenService.token;

  console.log('token interceptor')

  if (token) {
    const authReq = req.clone({
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token
      })
    });
    return next(authReq);
  }

  return next(req);
};
