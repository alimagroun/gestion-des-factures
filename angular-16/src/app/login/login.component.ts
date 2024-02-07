import { Component } from '@angular/core';
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

  constructor(private fb: FormBuilder, private authService: AuthService) {
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
          // Handle successful authentication (e.g., navigate to another page)
          console.log('Authentication successful');
        },
        error => {
          // Handle authentication error
          console.error('Authentication failed', error);
        }
      );
    }
  }
}
