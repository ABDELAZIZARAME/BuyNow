import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-layout">
      <!-- Sidebar Admin -->
      <aside class="admin-sidebar">
        <div class="admin-brand">
          <i class="fa fa-shield-halved"></i>
          <span>Admin Panel</span>
        </div>
        <nav class="admin-nav">
          <a routerLink="dashboard" routerLinkActive="active">
            <i class="fa fa-chart-line"></i> Dashboard
          </a>
          <a routerLink="produits" routerLinkActive="active">
            <i class="fa fa-box"></i> Produits
          </a>
          <a routerLink="commandes" routerLinkActive="active">
            <i class="fa fa-shopping-bag"></i> Commandes
          </a>
          <a routerLink="utilisateurs" routerLinkActive="active">
            <i class="fa fa-users"></i> Utilisateurs
          </a>
        </nav>
        <a routerLink="/produits" class="back-link">
          <i class="fa fa-arrow-left"></i> Retour boutique
        </a>
      </aside>

      <!-- Contenu Admin -->
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout { display: flex; min-height: 100vh; }
    .admin-sidebar {
      width: 240px;
      background: #1a2535;
      display: flex;
      flex-direction: column;
      padding: 1.5rem 0;
      position: fixed;
      height: 100vh;
    }
    .admin-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: white;
      font-size: 1.2rem;
      font-weight: 700;
      padding: 0 1.5rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
      margin-bottom: 1rem;
    }
    .admin-brand i { color: #f59e0b; }
    .admin-nav { flex: 1; padding: 0 0.75rem; }
    .admin-nav a {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: rgba(255,255,255,0.7);
      text-decoration: none;
      padding: 0.85rem 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
      transition: all 0.2s;
    }
    .admin-nav a:hover { background: rgba(255,255,255,0.08); color: white; }
    .admin-nav a.active { background: #1a6b4a; color: white; }
    .back-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      padding: 1rem 1.5rem;
      font-size: 0.85rem;
      border-top: 1px solid rgba(255,255,255,0.1);
    }
    .admin-content { margin-left: 240px; flex: 1; background: #f5f6fa; padding: 2rem; min-height: 100vh; }
  `]
})
export class AdminComponent {}
