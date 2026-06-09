import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/services/product.service';
import { OrderService } from '../../../core/services/order.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Dashboard</h2>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card green">
          <div class="stat-icon"><i class="fa fa-box"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ totalProduits }}</span>
            <span class="stat-label">Produits</span>
          </div>
        </div>
        <div class="stat-card blue">
          <div class="stat-icon"><i class="fa fa-shopping-bag"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ totalCommandes }}</span>
            <span class="stat-label">Commandes</span>
          </div>
        </div>
        <div class="stat-card orange">
          <div class="stat-icon"><i class="fa fa-users"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ totalUsers }}</span>
            <span class="stat-label">Utilisateurs</span>
          </div>
        </div>
        <div class="stat-card purple">
          <div class="stat-icon"><i class="fa fa-money-bill"></i></div>
          <div class="stat-info">
            <span class="stat-value">{{ chiffreAffaires }} MAD</span>
            <span class="stat-label">Chiffre d'affaires</span>
          </div>
        </div>
      </div>

      <!-- Commandes récentes -->
      <div class="section">
        <h3>Commandes récentes</h3>
        <table class="admin-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Client</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let order of recentOrders">
              <td>#{{ order.id }}</td>
              <td>{{ order.adresse.prenom }} {{ order.adresse.nom }}</td>
              <td>{{ order.total }} MAD</td>
              <td>
                <span class="badge" [class]="'badge-' + order.statut">
                  {{ order.statut }}
                </span>
              </td>
              <td>{{ order.date | date:'dd/MM/yyyy' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .dashboard h2 { margin-bottom: 2rem; color: #1a2535; }
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      color: white;
    }
    .green .stat-icon { background: #1a6b4a; }
    .blue .stat-icon { background: #3b82f6; }
    .orange .stat-icon { background: #f59e0b; }
    .purple .stat-icon { background: #8b5cf6; }
    .stat-value { display: block; font-size: 1.5rem; font-weight: 700; color: #1a2535; }
    .stat-label { font-size: 0.85rem; color: #888; }
    .section { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .section h3 { margin-bottom: 1rem; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { text-align: left; padding: 0.75rem; border-bottom: 2px solid #eee; font-size: 0.85rem; color: #888; }
    .admin-table td { padding: 0.75rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
    .badge-livree { background: #dcfce7; color: #166534; }
    .badge-livraison { background: #dbeafe; color: #1e40af; }
    .badge-confirmee { background: #fef9c3; color: #854d0e; }
    .badge-en-attente { background: #f3f4f6; color: #374151; }
    .badge-annulee { background: #fee2e2; color: #991b1b; }
  `]
})
export class DashboardComponent implements OnInit {
  totalProduits = 0;
  totalCommandes = 0;
  totalUsers = 0;
  chiffreAffaires = 0;
  recentOrders: any[] = [];

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe(p => this.totalProduits = p.length);
    this.orderService.getAll().subscribe(o => {
      this.totalCommandes = o.length;
      this.chiffreAffaires = o.reduce((sum, order) => sum + order.total, 0);
      this.recentOrders = o.slice(-5).reverse();
    });
    this.userService.getAll().subscribe(u => this.totalUsers = u.length);
  }
}
