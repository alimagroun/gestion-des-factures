import { Component, OnInit } from '@angular/core';
import { SettingsResponse } from '../models/settings-response';
import { UserService } from '../services/user.service';
import { SnackbarService } from '../services/snackbar.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-management',
  templateUrl: './account-management.component.html',
  styleUrls: ['./account-management.component.scss']
})
export class AccountManagementComponent implements OnInit{
  settings$!: Observable<SettingsResponse>;
  
  constructor(
    private userService: UserService,
    private snackbarService: SnackbarService
    ) {}

    ngOnInit(): void {
      this.loadUserSettings();
    }
  
    loadUserSettings(): void {
      this.settings$ = this.userService.getUserSettings();
    }

}
