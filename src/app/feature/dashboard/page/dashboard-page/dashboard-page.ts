import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { AuthService } from '../../../auth/service/auth-service';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { CommonModule } from '@angular/common';

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
    NzDrawerModule,
    CommonModule,
    NzListModule
  ],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit {
  isCollapsed = false;
  mobileOpen = false; // controla el drawer en móvil
  protected readonly date = new Date();

  public userFirstName!: String;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(() => (this.mobileOpen = false));
  }

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
