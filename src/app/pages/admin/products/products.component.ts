import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-products">
      <div class="page-header">
        <h2><i class="fa fa-box"></i> Gestion Produits</h2>
        <button class="btn-add" (click)="ouvrirModal()">
          <i class="fa fa-plus"></i> Ajouter
        </button>
      </div>

      <div class="search-bar">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="Rechercher..." [(ngModel)]="search" (input)="filtrer()"/>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of produitsFiltres">
            <td>{{ p.nom }}</td>
            <td>{{ p.categorie }}</td>
            <td>{{ p.prix }} MAD</td>
            <td>{{ p.stock }}</td>
            <td>
              <span class="badge" [class]="p.disponible ? 'badge-dispo' : 'badge-indispo'">
                {{ p.disponible ? 'Disponible' : 'Indisponible' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-edit" (click)="ouvrirModal(p)">
                  <i class="fa fa-pen"></i>
                </button>
                <button class="btn-delete" (click)="supprimer(p.id)">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Produit -->
      <div class="modal-overlay" *ngIf="showModal" (click)="fermerModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editMode ? 'Modifier' : 'Ajouter' }} un produit</h3>
          <div class="form-grid">
            <div class="form-group full">
              <label>Nom</label>
              <input type="text" [(ngModel)]="form.nom"/>
            </div>
            <div class="form-group">
              <label>Prix (MAD)</label>
              <input type="number" [(ngModel)]="form.prix"/>
            </div>
            <div class="form-group">
              <label>Stock</label>
              <input type="number" [(ngModel)]="form.stock"/>
            </div>
            <div class="form-group">
              <label>Catégorie</label>
              <select [(ngModel)]="form.categorie">
                <option>Électronique</option>
                <option>Maison</option>
                <option>Mode</option>
                <option>Sport</option>
              </select>
            </div>
            <div class="form-group">
              <label>Disponible</label>
              <select [(ngModel)]="form.disponible">
                <option [ngValue]="true">Oui</option>
                <option [ngValue]="false">Non</option>
              </select>
            </div>
            <div class="form-group full">
              <label>Description</label>
              <textarea [(ngModel)]="form.description" rows="3"></textarea>
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-cancel" (click)="fermerModal()">Annuler</button>
            <button class="btn-save" (click)="sauvegarder()">
              <i class="fa fa-save"></i> Sauvegarder
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { color: #1a2535; }
    .btn-add { background: #1a6b4a; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
    .search-bar { display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .search-bar input { border: none; outline: none; flex: 1; }
    .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .admin-table th { padding: 1rem; border-bottom: 2px solid #eee; text-align: left; color: #888; font-size: 0.85rem; background: white; }
    .admin-table td { padding: 1rem; border-bottom: 1px solid #eee; font-size: 0.9rem; color: #1a2535; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; }
    .badge-dispo { background: #dcfce7; color: #166534; }
    .badge-indispo { background: #fee2e2; color: #991b1b; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-edit { background: #dbeafe; color: #1e40af; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
    .btn-delete { background: #fee2e2; color: #991b1b; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; padding: 2rem; width: 580px; max-width: 90%; max-height: 90vh; overflow-y: auto; }
    .modal h3 { margin-bottom: 1.5rem; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { font-size: 0.85rem; font-weight: 500; color: #374151; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.65rem; border: 1px solid #ddd; border-radius: 8px; outline: none; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; }
    .btn-cancel { padding: 0.75rem 1.5rem; border: 1px solid #ddd; background: white; border-radius: 8px; cursor: pointer; }
    .btn-save { padding: 0.75rem 1.5rem; background: #1a6b4a; color: white; border: none; border-radius: 8px; cursor: pointer; }
  `]
})
export class AdminProductsComponent implements OnInit {
  produits: Product[] = [];
  produitsFiltres: Product[] = [];
  search = '';
  showModal = false;
  editMode = false;
  editId: number | null = null;

  form: any = {
    nom: '', description: '', prix: 0, stock: 0,
    categorie: 'Électronique', sousCategorie: 'PC',
    marque: '', disponible: true, note: 4.0, avis: 0
  };

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe(p => {
      this.produits = p;
      this.produitsFiltres = p;
    });
  }

  filtrer() {
    this.produitsFiltres = this.produits.filter(p =>
      p.nom.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  ouvrirModal(product?: Product) {
    if (product) {
      this.editMode = true;
      this.editId = product.id;
      this.form = { ...product };
    } else {
      this.editMode = false;
      this.editId = null;
      this.form = {
        nom: '', description: '', prix: 0, stock: 0,
        categorie: 'Électronique', sousCategorie: 'PC',
        marque: '', disponible: true, note: 4.0, avis: 0
      };
    }
    this.showModal = true;
  }

  fermerModal() { this.showModal = false; }

  sauvegarder() {
    if (this.editMode && this.editId) {
      this.productService.modifier(this.editId, this.form);
    } else {
      this.productService.ajouter(this.form);
    }
    this.fermerModal();
  }

  supprimer(id: number) {
    if (confirm('Supprimer ce produit ?')) {
      this.productService.supprimer(id);
    }
  }
}