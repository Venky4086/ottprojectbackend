import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginData = {emailOrUsername: '', password: '', message: ''};

  constructor(private _auth: AuthService,
              private spinner: NgxSpinnerService,
              private router: Router,
              private toastr: ToastrService
    ) { }

  ngOnInit() {
    if (localStorage.getItem('ott_user')) {
      // this.router.navigate(['/dashboard']);
      window.location.href = '/#/dashboard';
    }
  }

  submitLogin() {
    const main = this
    main.spinner.show();
    main.loginData.message = '';

    this._auth.letSubmitLogin(this.loginData).subscribe(
        res => {
          main.spinner.hide();

          if (res && res.token) {
            localStorage.setItem('ott_user', JSON.stringify(res.result));
            // window.location.href = '/#/dashboard';
            this.router.navigate(['/dashboard']);
          } else {
           this.loginData.message = res.message;
          }
        },
        err => {
          main.spinner.hide();
        }
      );
  }

}
