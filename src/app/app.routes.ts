import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'docs',
    loadComponent: () =>
      import('./pages/docs/docs.component').then((m) => m.DocsComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./pages/products/products.component').then(
        (m) => m.ProductsComponent
      ),
  },
  {
    path: 'drug-classes',
    loadComponent: () =>
      import('./pages/drug-classes/drug-classes.component').then(
        (m) => m.DrugClassesComponent
      ),
  },
  {
    path: 'shelves',
    loadComponent: () =>
      import('./pages/shelves/shelves.component').then(
        (m) => m.ShelvesComponent
      ),
  },
  {
    path: 'dosage-forms',
    loadComponent: () =>
      import('./pages/dosage-forms/dosage-forms.component').then(
        (m) => m.DosageFormsComponent
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/users/users.component').then((m) => m.UsersComponent),
  },
  {
    path: 'roles',
    loadComponent: () =>
      import('./pages/roles/roles.component').then((m) => m.RolesComponent),
  },
  {
    path: 'audit-logs',
    loadComponent: () =>
      import('./pages/audit-logs/audit-logs.component').then(
        (m) => m.AuditLogsComponent
      ),
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./pages/branches/branches.component').then(
        (m) => m.BranchesComponent
      ),
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./pages/sales/sales.component').then((m) => m.SalesComponent),
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('./pages/suppliers/suppliers.component').then(
        (m) => m.SuppliersComponent
      ),
  },
  {
    path: 'suppliers/:id/products',
    loadComponent: () =>
      import('./pages/supplier-products/supplier-products.component').then(
        (m) => m.SupplierProductsComponent
      ),
  },
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
  {
    path: '**',
    redirectTo: '404',
  },
];
