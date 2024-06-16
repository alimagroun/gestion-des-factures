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

  navigateToAccountManagement(): void {
    this.router.navigate(['/account-management']);
  }

  logout() {
    this.authService.logout().subscribe(
      () => {
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Logout failed', error);
      }
    );
}
}
