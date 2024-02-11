import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AuthenticationRequest } from '../models/authentication-request';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      const request: AuthenticationRequest = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };

      this.authService.authenticate(request).subscribe(
        () => {
          console.log('Authentication successful');
        this.router.navigate(['/invoice-list']);
        },
        error => {
          // Handle authentication error
          console.error('Authentication failed', error);
        }
      );
    }
  }
}
