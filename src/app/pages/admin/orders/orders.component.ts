import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/order.service';
import { Order } from '../../../core/models/index';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-orders">
      <div class="page-header">
        <h2><i class="fa fa-shopping-bag"></i> Gestion Commandes</h2>
      </div>

      <div class="filters">
        <button *ngFor="let s of statuts" class="filter-btn"
          [class.active]="selectedStatut === s"
          (click)="selectedStatut = s; filtrer()">
          {{ s === 'tous' ? 'Toutes' : s }}
        </button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>#ID</th>
            <th>Client</th>
            <th>Produits</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of ordersFiltres">
            <td><strong>#{{ order.id }}</strong></td>
            <td>
              <div>{{ order.adresse.prenom }} {{ order.adresse.nom }}</div>
              <small>{{ order.adresse.email }}</small>
            </td>
            <td>{{ order.items.length }} article(s)</td>
            <td><strong>{{ order.total }} MAD</strong></td>
            <td>
              <select class="statut-select" [class]="'sel-' + order.statut"
                [(ngModel)]="order.statut"
                (change)="changerStatut(order.id, order.statut)">
                <option value="en-attente">En attente</option>
                <option value="confirmee">Confirmée</option>
                <option value="livraison">En livraison</option>
                <option value="livree">Livrée</option>
                <option value="annulee">Annulée</option>
              </select>
            </td>
            <td>{{ order.date | date:'dd/MM/yyyy' }}</td>
            <td>
              <button class="btn-delete" (click)="supprimer(order.id)">
                <i class="fa fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { color: #1a2535; }
    .filters { display: flex; gap: 0.75rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .filter-btn { padding: 0.5rem 1rem; border: 1px solid #ddd; background: white; border-radius: 20px; cursor: pointer; font-size: 0.85rem; }
    .filter-btn.active { background: #1a6b4a; color: white; border-color: #1a6b4a; }
    .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .admin-table th { padding: 1rem; border-bottom: 2px solid #eee; text-align: left; color: #888; font-size: 0.85rem; }
    .admin-table td { padding: 1rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .admin-table small { color: #888; font-size: 0.8rem; }
    .statut-select { padding: 0.4rem 0.75rem; border-radius: 20px; border: none; font-size: 0.8rem; cursor: pointer; font-weight: 500; }
    .sel-livree { background: #dcfce7; color: #166534; }
    .sel-livraison { background: #dbeafe; color: #1e40af; }
    .sel-confirmee { background: #fef9c3; color: #854d0e; }
    .sel-en-attente { background: #f3f4f6; color: #374151; }
    .sel-annulee { background: #fee2e2; color: #991b1b; }
    .btn-delete { background: #fee2e2; color: #991b1b; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
  `]
})
export class AdminOrdersComponent implements OnInit {
  orders: Order[] = [];
  ordersFiltres: Order[] = [];
  statuts = ['tous', 'en-attente', 'confirmee', 'livraison', 'livree', 'annulee'];
  selectedStatut = 'tous';

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAll().subscribe(o => {
      this.orders = o;
      this.filtrer();
    });
  }

  filtrer() {
    this.ordersFiltres = this.selectedStatut === 'tous'
      ? [...this.orders]
      : this.orders.filter(o => o.statut === this.selectedStatut);
  }

  changerStatut(id: number, statut: Order['statut']) {
    this.orderService.changerStatut(id, statut);
  }

  supprimer(id: number) {
    if (confirm('Supprimer cette commande ?')) {
      this.orderService.supprimer(id);
    }
  }
}
