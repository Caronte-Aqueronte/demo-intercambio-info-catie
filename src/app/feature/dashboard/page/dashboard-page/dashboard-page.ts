import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../../auth/service/auth-service';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    NzBreadCrumbModule,
    NzIconModule,
    NzMenuModule,
    NzLayoutModule,
    NzButtonModule,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  isCollapsed = false;
  protected readonly date = new Date();

  public userFirstName!: String;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const firstName: String = this.authService.getUserName();
    this.userFirstName = firstName ?? 'Invitado';
  }

  /**
   * Maneja la accion de logout
   */
  public onLogout(): void {
    this.authService.logout();
  }
}
