import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) {}

  openSnackBar(message: string, action: string, duration = 2500) {
    this.snackBar.open(message, action, {
      duration: duration,
    });
  }
}
