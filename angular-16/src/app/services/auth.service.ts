import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationRequest } from '../models/authentication-request';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = environment.apiUrl.auth;

  constructor(private http: HttpClient) {}

  authenticate(request: AuthenticationRequest): Observable<void> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<void>(`${this.baseUrl}/authenticate`, request, { headers });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/logout7`, {});
  }
}
