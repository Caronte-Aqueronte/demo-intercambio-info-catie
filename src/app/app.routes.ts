import { Routes } from '@angular/router';
import { LoginPage } from './feature/auth/login/page/login-page/login-page';
import { DashboardPage } from './feature/dashboard/page/dashboard-page/dashboard-page';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPage,
  },

  {
    path: 'dashboard',
    component: DashboardPage,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },

      // {
      //   path: 'home',
      //   component: HomePage,
      // },
    ],
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
