import { Component, OnInit } from '@angular/core';
import { SettingsResponse } from '../models/settings-response';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit{
  settings$!: Observable<SettingsResponse>;
  settingsForm!: FormGroup;
  
  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
    ) {}

    ngOnInit(): void {
      this.loadUserSettings();
      this.settingsForm = this.fb.group({
        taxPercentage: [0, [Validators.required, Validators.min(0)]],
        stamp: [0, [Validators.required, Validators.min(0)]]
      });
    }
  
    loadUserSettings(): void {
      this.settings$ = this.userService.getUserSettings();
      this.settings$.subscribe(
        (settings: SettingsResponse) => {
          this.settingsForm.patchValue(settings);
        },
        error => {
          console.error('Error loading user settings', error);
        }
      );
    }

    updateUserSettings(): void {
      if (this.settingsForm.valid) {
        const settingsResponse: SettingsResponse = this.settingsForm.value;
  
        this.userService.updateUserSettings(settingsResponse).subscribe(
          (updatedSettings: SettingsResponse) => {
            this.snackbarService.openSnackBar('Les paramètres ont été mis à jour.', 'Fermer');
          },
          error => {
            console.error('Error updating settings', error);

          }
        );
      } 
    }
}
