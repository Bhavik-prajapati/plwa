import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from './login.service';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from "../../components/header/header.component";
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, JsonPipe, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']  // Fixed the typo here to `styleUrls`
})
export class LoginComponent {

  userdata: any = {
    email: "",
    password: ""
  };

  response: any = "";

  constructor(private loginservice: LoginService, private router: Router) {
    const token = localStorage.getItem("token");
    if (token) {
      this.router.navigateByUrl("home");
    }
  }

    loginWithGoogle() {
      window.location.href = 'http://localhost:5000/auth/google';
    }


  login() {
    console.log(this.userdata);
    this.loginservice.login(this.userdata).subscribe(
      (res: any) => {
        if (res && res.accessToken && res.refreshToken) {

          localStorage.setItem("token",res.accessToken);
          localStorage.setItem("refreshtoken",res.refreshToken);
          this.router.navigateByUrl("home");
          // localStorage.setItem("token", res.token);
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
