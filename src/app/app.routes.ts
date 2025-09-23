import { Routes } from '@angular/router';
import { LoginPage } from './feature/auth/login/page/login-page/login-page';
import { DashboardPage } from './feature/dashboard/page/dashboard-page/dashboard-page';
import { HomePage } from './feature/home/page/home-page/home-page';
import { DocumentPage } from './feature/document/page/document-page/document-page';
import { MapPage } from './feature/map/page/map-page/map-page';

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

      {
        path: 'home',
        component: HomePage,
      },

      {
        path: 'documents',
        component: DocumentPage,
      },

      {
        path: 'maps',
        component: MapPage,
      },
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
