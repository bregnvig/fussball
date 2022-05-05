import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerApiService } from '@fussball/api';

@Component({
  selector: 'sha-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {

  constructor(private service: PlayerApiService, private router: Router) {
  }

  loginWithGoogle() {
    this.router.navigate(['/']).then(() => this.service.signInWithGoogle());
  }

  loginWithFacebook() {
    this.router.navigate(['/']).then(() => this.service.signInWithFacebook());
  }

}
