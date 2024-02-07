import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Logout successful');
        // Perform any additional actions after successful logout
      },
      error => {
        console.error('Logout failed', error);
        // Handle logout failure
      }
    );
}
}
