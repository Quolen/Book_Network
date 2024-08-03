import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthenticationRequest} from "../../service/models/authentication-request";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/services/authentication.service";
import {NgForOf, NgIf} from "@angular/common";
import {TokenService} from "../../service/token/token.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {email: '', password: ''};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService
  ) {
  }

  login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        console.log(res);
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else if (err.error.error) {
          this.errorMsg.push(err.error.error);
        } else {
          this.errorMsg = ['Unknown error'];
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }
}