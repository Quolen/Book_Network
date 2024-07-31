/* tslint:disable */
/* eslint-disable */
import {HttpClient, HttpContext, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {BaseService} from '../base-service';
import {ApiConfiguration} from '../api-configuration';

import {Authenticate$Params} from '../fn/authentication/authenticate';
import {AuthenticationResponse} from '../models/authentication-response';
import {Confirm$Params} from '../fn/authentication/confirm';
import {Register$Params} from '../fn/authentication/register';

@Injectable({providedIn: 'root'})
export class AuthenticationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `register()` */
  static readonly RegisterPath = '/auth/register';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `register()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register$Response(params: Register$Params, context?: HttpContext): Observable<HttpResponse<{}>> {
    // Use HttpClient directly for full response
    return this.http.post<{}>(`${this.rootUrl}${AuthenticationService.RegisterPath}`, params.body, { observe: 'response', context });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `register$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register(params: Register$Params, context?: HttpContext): Observable<{}> {
    return this.register$Response(params, context).pipe(
      map((response: HttpResponse<{}>): {} => {
        console.log('Register Response:', response); // Optional logging for debugging
        return response.body!;
      })
    );
  }

  /** Path part for operation `authenticate()` */
  static readonly AuthenticatePath = '/auth/authenticate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<HttpResponse<AuthenticationResponse>> {
    // Use HttpClient directly for full response
    return this.http.post<AuthenticationResponse>(`${this.rootUrl}${AuthenticationService.AuthenticatePath}`, params.body, { observe: 'response', context });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authenticate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      map((response: HttpResponse<AuthenticationResponse>): AuthenticationResponse => {
        console.log('Authenticate Response:', response); // Optional logging for debugging
        return response.body!;
      })
    );
  }

  /** Path part for operation `confirm()` */
  static readonly ConfirmPath = '/auth/activate-account';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `confirm()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm$Response(params: Confirm$Params, context?: HttpContext): Observable<HttpResponse<void>> {
    // Use HttpClient directly for full response
    return this.http.get<void>(`${this.rootUrl}${AuthenticationService.ConfirmPath}?token=${params.token}`, { observe: 'response', context });
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `confirm$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  confirm(params: Confirm$Params, context?: HttpContext): Observable<void> {
    return this.confirm$Response(params, context).pipe(
      map((response: HttpResponse<void>): void => {
        console.log('Confirm Response:', response); // Optional logging for debugging
        return;
      })
    );
  }
}

