import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../service/services/authentication.service";
import {NgIf} from "@angular/common";
import {CodeInputModule} from "angular-code-input";

@Component({
  selector: 'app-activate-account',
  standalone: true,
  imports: [
    NgIf,
    CodeInputModule
  ],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  message = '';
  isOk = true;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
  ) {
  }

  onCodeCompleted(token: string) {
    this.activateAccount(token);
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }

  private activateAccount(token: string) {
    this.authService.confirm({
      token
    }).subscribe({
      next: () => {
        this.message = 'Your account has been activated.\n You can login to proceed';
        this.submitted = true;
        this.isOk = true;
      },
      error: () => {
        this.message = 'Your code has expired or invalid';
        this.submitted = true;
        this.isOk = false;
      }
    })
  }
}
