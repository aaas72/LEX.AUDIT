import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./features/public/features/features.component').then(m => m.FeaturesComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./features/audit/audit-workspace/audit-workspace.component').then(m => m.AuditWorkspaceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contracts',
    loadComponent: () => import('./features/contracts/contracts.component').then(m => m.ContractsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/public/privacy/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/public/terms/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'cookie',
    loadComponent: () => import('./features/public/cookie/cookie.component').then(m => m.CookieComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/auth.component').then(m => m.AuthComponent)
  }
];
