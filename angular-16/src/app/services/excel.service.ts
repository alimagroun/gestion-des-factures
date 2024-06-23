import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  private readonly apiUrl = environment.apiUrl.excel;

  constructor(private http: HttpClient) { }

  downloadCustomersExcel(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/vnd.ms-excel',
      'Accept': 'application/vnd.ms-excel'
    });

    return this.http.get(`${this.apiUrl}/download-customers`, {
      headers: headers,
      responseType: 'blob'
    });
  }
}
