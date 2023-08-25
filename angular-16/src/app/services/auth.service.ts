import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest } from '../models/register-request';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://api.myapp.com'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  // Define a method to handle registration
  register(registerRequest: RegisterRequest): Observable<any> {
    const registerUrl = `${this.apiUrl}/register`; // Replace with your actual registration endpoint
    return this.http.post<any>(registerUrl, registerRequest);
  }
}
