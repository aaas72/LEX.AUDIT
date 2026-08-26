import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./features/public/pricing/pricing.component').then(m => m.PricingComponent)
  },
  {
    path: 'features',
    loadComponent: () => import('./features/public/features/features.component').then(m => m.FeaturesComponent)
  },
  {
    path: 'audit',
    loadComponent: () => import('./features/audit/audit-workspace/audit-workspace.component').then(m => m.AuditWorkspaceComponent)
  }
];
