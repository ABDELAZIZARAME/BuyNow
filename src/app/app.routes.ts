import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'produits', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'produits',
    loadComponent: () => import('./pages/catalogue/catalogue.component').then(m => m.CatalogueComponent)
  },
  {
    path: 'produit/:id',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'panier',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'commande',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
    // Note: Guest et User peuvent commander — pas de guard ici
  },
  {
    path: 'compte',
    loadComponent: () => import('./pages/account/account.component').then(m => m.AccountComponent),
    canActivate: [authGuard]  // Requiert connexion
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [adminGuard],  // Requiert rôle admin
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'produits',
        loadComponent: () => import('./pages/admin/products/products.component').then(m => m.AdminProductsComponent)
      },
      {
        path: 'commandes',
        loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.AdminOrdersComponent)
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./pages/admin/users/users.component').then(m => m.AdminUsersComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'produits' }
];
