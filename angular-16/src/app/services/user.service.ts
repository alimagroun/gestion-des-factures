import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SettingsResponse } from '../models/settings-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.apiUrl.users;

  constructor(private http: HttpClient) {}

  getUserSettings(): Observable<SettingsResponse> {
    const url = `${this.apiUrl}/settings`;
    return this.http.get<SettingsResponse>(url);
  }
}
