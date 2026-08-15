import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'r/:slug', loadComponent: () => import('./pages/public-share.component').then(m => m.PublicShareComponent) },
  { path: 'login', loadComponent: () => import('./pages/login.component').then(m => m.LoginComponent) },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'documents',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/documents.component').then(m => m.DocumentsComponent),
  },
  {
    path: 'documents/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/document-editor.component').then(m => m.DocumentEditorComponent),
  },
  {
    path: 'templates',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/templates.component').then(m => m.TemplatesComponent),
  },
  {
    path: 'applications',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/applications.component').then(m => m.ApplicationsComponent),
  },
  {
    path: 'shares',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/shares.component').then(m => m.SharesComponent),
  },
  {
    path: 'exports',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/exports.component').then(m => m.ExportsComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
