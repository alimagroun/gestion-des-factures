import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: []
})
export class AppHeaderComponent {

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout().subscribe(
      () => {
        console.log('Logout successful');
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Logout failed', error);
        // Handle logout failure
      }
    );
}
}
