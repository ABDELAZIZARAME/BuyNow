import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="catalogue-page">
      <aside class="sidebar">
        <h3><i class="fa fa-filter"></i> Filtres</h3>

        <div class="filter-group">
          <h4>Catégorie</h4>
          <label *ngFor="let cat of categories" class="checkbox-label">
            <input type="radio" name="categorie" [value]="cat"
              [(ngModel)]="selectedCategorie" (change)="appliquerFiltres()"/>
            {{ cat }}
            <span class="count">({{ categorieCounts[cat] || 0 }})</span>
          </label>
          <label class="checkbox-label">
            <input type="radio" name="categorie" value=""
              [(ngModel)]="selectedCategorie" (change)="appliquerFiltres()"/>
            Toutes
          </label>
        </div>

        <div class="filter-group">
          <h4>Prix (MAD)</h4>
          <div class="prix-range">
            <span>{{ prixMin }} MAD</span>
            <span>{{ prixMax }} MAD</span>
          </div>
          <input type="range" min="0" max="5000" step="50"
            [(ngModel)]="prixMax" (input)="appliquerFiltres()"/>
        </div>

        <button class="btn-reset" (click)="reinitialiser()">
          <i class="fa fa-rotate-left"></i> Réinitialiser
        </button>
      </aside>

      <main class="catalogue-main">
        <div class="breadcrumb">
          <span>Accueil</span>
          <i class="fa fa-chevron-right"></i>
          <span>{{ selectedCategorie || 'Tous les produits' }}</span>
        </div>

        <div class="search-bar">
          <i class="fa fa-search"></i>
          <input type="text" placeholder="Rechercher un produit..."
            [(ngModel)]="searchQuery" (input)="appliquerFiltres()"/>
          <span class="results-count">{{ produitsFiltres.length }} produits</span>
        </div>

        <div class="products-grid" *ngIf="produitsFiltres.length > 0; else empty">
          <div class="product-card" *ngFor="let product of produitsFiltres; trackBy: trackByProductId">

            <div class="card-image" [routerLink]="['/produit', product.id]">
              <div class="badge" *ngIf="product.badge"
                [class]="'badge-' + product.badge">
                {{ getBadgeLabel(product.badge) }}
              </div>
              <img [src]="product.image" [alt]="product.nom" class="product-img" />
            </div>

            <div class="card-body">
              <p class="sous-categorie">{{ product.sousCategorie }}</p>
              <h3 [routerLink]="['/produit', product.id]">{{ product.nom }}</h3>
              <div class="prix-section">
                <span class="prix">{{ product.prix }} MAD</span>
                <span class="prix-original" *ngIf="product.prixOriginal">
                  {{ product.prixOriginal }} MAD
                </span>
              </div>
              <div class="note">
                <i class="fa fa-star" *ngFor="let s of product.starsArray"></i>
                <span>({{ product.avis }})</span>
              </div>
              <button class="btn-ajouter"
                [disabled]="!product.disponible"
                (click)="ajouterAuPanier(product)">
                <i class="fa fa-plus"></i>
                {{ product.disponible ? '+ Ajouter' : 'Indisponible' }}
              </button>
            </div>
          </div>
        </div>

        <ng-template #empty>
          <div class="empty-state">
            <i class="fa fa-search fa-3x"></i>
            <p>Aucun produit trouvé</p>
            <button (click)="reinitialiser()">Réinitialiser les filtres</button>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styles: [`
    .catalogue-page {
      display: flex;
      gap: 2rem;
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
    }
    .sidebar {
      width: 250px;
      flex-shrink: 0;
      background: white;
      border-radius: 16px;
      padding: 1.5rem;
      height: fit-content;
      box-shadow: 0 4px 20px -2px rgba(79, 70, 229, 0.04);
      border: 1px solid #e2e8f0;
    }
    .sidebar h3 { color: #4f46e5; margin-bottom: 1.5rem; font-weight: 700; }
    .filter-group { margin-bottom: 1.5rem; }
    .filter-group h4 { margin-bottom: 0.75rem; color: #0f172a; font-size: 0.95rem; font-weight: 600; }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #475569;
    }
    input[type=radio] { accent-color: #4f46e5; cursor: pointer; }
    .count { color: #94a3b8; font-size: 0.85rem; margin-left: auto; }
    .prix-range { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.85rem; color: #475569; }
    input[type=range] { width: 100%; accent-color: #4f46e5; cursor: pointer; }
    
    .btn-reset {
      width: 100%;
      padding: 0.65rem;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
      border-radius: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }
    .btn-reset:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fca5a5;
    }

    .catalogue-main { flex: 1; }
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #94a3b8;
      font-size: 0.85rem;
      margin-bottom: 1rem;
    }
    .search-bar {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 12px;
      padding: 0.75rem 1rem;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 20px -2px rgba(79, 70, 229, 0.04);
      border: 1px solid #e2e8f0;
      color: #94a3b8;
    }
    .search-bar input { flex: 1; border: none; outline: none; font-size: 0.95rem; color: #0f172a; }
    .search-bar input::placeholder { color: #94a3b8; }
    .results-count { color: #64748b; font-size: 0.85rem; white-space: nowrap; }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
      border: 1px solid #e2e8f0;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      /* ✅ SECURISÉ : Hauteur minimale pour verrouiller le layout */
      min-height: 390px; 
    }
    .product-card:hover { 
      transform: translateY(-6px); 
      box-shadow: 0 12px 25px -5px rgba(79, 70, 229, 0.1);
      border-color: rgba(79, 70, 229, 0.15);
    }
    
    .card-image {
      background: #f8fafc;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      overflow: hidden;
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .product-card:hover .product-img {
      transform: scale(1.05);
    }

    .badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 0.35rem 0.7rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      z-index: 2;
    }
    .badge-promo { background: #f59e0b; }
    .badge-nouveau { background: #4f46e5; }
    .badge-stock-bas { background: #ef4444; }
    
    .card-body { padding: 1.25rem; }
    .sous-categorie { color: #64748b; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.4rem; font-weight: 600; }
    .card-body h3 { font-size: 1rem; margin-bottom: 0.5rem; cursor: pointer; color: #0f172a; font-weight: 700; line-height: 1.4; }
    .card-body h3:hover { color: #4f46e5; }
    
    .prix-section { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; }
    .prix { color: #4f46e5; font-weight: 800; font-size: 1.2rem; }
    .prix-original { color: #94a3b8; text-decoration: line-through; font-size: 0.85rem; }
    
    .note { color: #ffb800; font-size: 0.8rem; margin-bottom: 0.85rem; }
    .note span { color: #64748b; margin-left: 0.3rem; font-weight: 500; }
    
    .btn-ajouter {
      width: 100%;
      padding: 0.7rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      box-shadow: 0 4px 10px rgba(79, 70, 229, 0.15);
      transition: all 0.2s ease;
    }
    .btn-ajouter:hover:not(:disabled) { 
      background: #3730a3; 
      box-shadow: 0 6px 15px rgba(79, 70, 229, 0.25);
    }
    .btn-ajouter:disabled { background: #cbd5e1; color: #64748b; cursor: not-allowed; box-shadow: none; }
    
    .empty-state {
      text-align: center;
      padding: 5rem 2rem;
      color: #64748b;
    }
    .empty-state button {
      margin-top: 1.25rem;
      padding: 0.7rem 1.75rem;
      background: #4f46e5;
      color: white;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
    }
  `]
})
export class CatalogueComponent implements OnInit {
  produits: (Product & { starsArray?: number[] })[] = [];
  produitsFiltres: (Product & { starsArray?: number[] })[] = [];
  categories: string[] = [];
  categorieCounts: { [key: string]: number } = {}; // Dictionnaire de stockage
  selectedCategorie = '';
  searchQuery = '';
  prixMin = 0;
  prixMax = 5000;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.productService.getAll().subscribe(products => {
      // ✅ Pré-calcul des étoiles une seule fois pour éviter le calcul au scroll
      this.produits = products.map(p => ({
        ...p,
        starsArray: Array(Math.round(p.note || 5)).fill(0)
      }));
      this.produitsFiltres = [...this.produits];
      
      // ✅ Pré-calcul du nombre de produits par catégorie
      this.calculerNombreParCategorie();
    });
    
    this.categories = this.productService.getCategories();

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.appliquerFiltres();
      }
      if (params['cat']) {
        this.selectedCategorie = params['cat'];
        this.appliquerFiltres();
      }
    });
  }

  // ✅ Nouvelle méthode pour stocker les totaux de catégories
  calculerNombreParCategorie() {
    this.categorieCounts = {};
    this.produits.forEach(p => {
      if (p.categorie) {
        this.categorieCounts[p.categorie] = (this.categorieCounts[p.categorie] || 0) + 1;
      }
    });
  }

  appliquerFiltres() {
    const filtresBruts = this.productService.filtrer(
      this.searchQuery, this.selectedCategorie, this.prixMin, this.prixMax
    );
    // Conserver le tableau pré-calculé des étoiles après filtrage
    this.produitsFiltres = filtresBruts.map(f => {
      const original = this.produits.find(p => p.id === f.id);
      return original ? original : { ...f, starsArray: Array(Math.round(f.note || 5)).fill(0) };
    });
  }

  reinitialiser() {
    this.searchQuery = '';
    this.selectedCategorie = '';
    this.prixMin = 0;
    this.prixMax = 5000;
    this.produitsFiltres = [...this.produits];
  }

  ajouterAuPanier(product: Product) {
    this.cartService.ajouter(product);
  }

  // ✅ Fonction TrackBy essentielle pour stabiliser le scroll du DOM
  trackByProductId(index: number, product: any): number {
    return product.id;
  }

  getBadgeLabel(badge: string): string {
    const labels: any = { promo: '-20%', nouveau: 'Nouveau', 'stock-bas': 'Stock bas' };
    return labels[badge] || badge;
  }
}