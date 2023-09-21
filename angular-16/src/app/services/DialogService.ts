import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDeleteConfirmationDialog(confirmationMessage: string): any {
    return this.dialog
      .open(DeleteConfirmationDialogComponent, {
        width: 'auto',
        data: { confirmationMessage },
      })
      .afterClosed();
  }
}
