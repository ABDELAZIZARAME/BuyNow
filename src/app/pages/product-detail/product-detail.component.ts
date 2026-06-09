import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail-page" *ngIf="product; else loading">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <a routerLink="/produits">Accueil</a>
        <i class="fa fa-chevron-right"></i>
        <a [routerLink]="['/produits']" [queryParams]="{cat: product.categorie}">
          {{ product.categorie }}
        </a>
        <i class="fa fa-chevron-right"></i>
        <span>{{ product.nom }}</span>
      </div>

      <div class="detail-container">
        <!-- Images -->
        <div class="images-section">
          <div class="main-image">
            <div *ngIf="product.reduction" class="badge-promo">
              -{{ product.reduction }}%
            </div>
            <img [src]="product.image" [alt]="product.nom" class="main-img" />
          </div>
          <div class="thumbnails">
            <div class="thumb active" *ngFor="let i of [1,2,3,4]">
              <img [src]="product.image" [alt]="product.nom" class="thumb-img" />
            </div>
          </div>
        </div>

        <!-- Infos -->
        <div class="info-section">
          <p class="meta">{{ product.sousCategorie }} · {{ product.marque }}</p>
          <h1>{{ product.nom }}</h1>

          <div class="note">
            <i class="fa fa-star" *ngFor="let s of getStars(product.note)"></i>
            <span>{{ product.note }} · {{ product.avis }} avis</span>
          </div>

          <div class="prix-section">
            <span class="prix">{{ product.prix }} MAD</span>
            <span class="prix-original" *ngIf="product.prixOriginal">
              {{ product.prixOriginal }} MAD
            </span>
            <span class="badge-reduction" *ngIf="product.reduction">
              -{{ product.reduction }}%
            </span>
          </div>

          <div class="description">
            <h4>Description</h4>
            <p>{{ product.description }}</p>
          </div>

          <div class="stock-info" [class.indispo]="!product.disponible">
            <i class="fa" [class]="product.disponible ? 'fa-check' : 'fa-times'"></i>
            {{ product.disponible ? 'En stock (' + product.stock + ' unités)' : 'Indisponible' }}
          </div>

          <div class="quantite-section" *ngIf="product.disponible">
            <span>Quantité</span>
            <div class="quantite-control">
              <button (click)="decrement()"><i class="fa fa-minus"></i></button>
              <span>{{ quantite }}</span>
              <button (click)="increment()"><i class="fa fa-plus"></i></button>
            </div>
          </div>

          <div class="actions">
            <button class="btn-panier" [disabled]="!product.disponible"
              (click)="ajouterAuPanier()">
              <i class="fa fa-shopping-cart"></i>
              + Ajouter au panier
            </button>
            <button class="btn-favoris" [class.active]="isFavoris" (click)="toggleFavoris()">
              <i class="fa fa-heart"></i> Favoris
            </button>
          </div>

          <div class="success-msg" *ngIf="ajouteMsg">
            <i class="fa fa-check"></i> Produit ajouté au panier !
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="loading">
        <i class="fa fa-spinner fa-spin fa-3x"></i>
        <p>Chargement...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-page { max-width: 1200px; margin: 0 auto; padding: 1.5rem; }
    .breadcrumb { display: flex; align-items: center; gap: 0.5rem; color: #888; font-size: 0.85rem; margin-bottom: 2rem; }
    .breadcrumb a { color: #1a47b8; text-decoration: none; }
    .detail-container { display: flex; gap: 3rem; }
    .images-section { width: 400px; flex-shrink: 0; }
    .main-image {
      background: #eff6ff;
      border-radius: 12px;
      height: 320px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .main-img {
      max-height: 280px;
      max-width: 100%;
      object-fit: contain;
    }
    .badge-promo {
      position: absolute;
      top: 12px;
      left: 12px;
      background: #1a47b8;
      color: white;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }
    .thumbnails { display: flex; gap: 0.75rem; }
    .thumb {
      width: 70px;
      height: 70px;
      background: #eff6ff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      cursor: pointer;
      overflow: hidden;
    }
    .thumb.active { border-color: #1a47b8; }
    .thumb-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .info-section { flex: 1; }
    .meta { color: #888; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 0.5rem; }
    h1 { font-size: 1.8rem; margin-bottom: 0.75rem; color: #222; }
    .note { color: #f59e0b; margin-bottom: 1rem; }
    .note span { color: #888; margin-left: 0.5rem; }
    .prix-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .prix { color: #1a47b8; font-size: 2rem; font-weight: 700; }
    .prix-original { color: #aaa; text-decoration: line-through; font-size: 1.1rem; }
    .badge-reduction { background: #f59e0b; color: white; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.9rem; }
    .description h4 { margin-bottom: 0.5rem; }
    .description p { color: #555; line-height: 1.6; margin-bottom: 1.5rem; }
    .stock-info { margin-bottom: 1.5rem; color: #1a47b8; }
    .stock-info.indispo { color: #ef4444; }
    .quantite-section { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .quantite-control { display: flex; align-items: center; gap: 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
    .quantite-control button { padding: 0.5rem 1rem; border: none; background: white; cursor: pointer; font-size: 1rem; }
    .quantite-control span { padding: 0.5rem 1.5rem; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
    .actions { display: flex; gap: 1rem; margin-bottom: 1rem; }
    .btn-panier {
      flex: 1;
      padding: 1rem;
      background: linear-gradient(135deg, #2563eb, #0d2b6e);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }
    .btn-panier:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
    .btn-panier:disabled { background: #cbd5e1; cursor: not-allowed; }
    .btn-favoris {
      padding: 1rem 1.5rem;
      border: 1.5px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-favoris:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
    .btn-favoris.active { background: #fee2e2; border-color: #dc2626; color: #dc2626; }
    .success-msg { color: #1a47b8; font-weight: 500; }
    .loading { text-align: center; padding: 4rem; color: #888; }
  `]
})
export class ProductDetailComponent implements OnInit {
  product: Product | undefined;
  quantite = 1;
  ajouteMsg = false;
  isFavoris = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.productService.getById(+params['id']).subscribe(p => {
        this.product = p;
      });
    });
  }

  toggleFavoris() { this.isFavoris = !this.isFavoris; }

  increment() { if (this.product && this.quantite < this.product.stock) this.quantite++; }
  decrement() { if (this.quantite > 1) this.quantite--; }

  ajouterAuPanier() {
    if (this.product) {
      this.cartService.ajouter(this.product, this.quantite);
      this.ajouteMsg = true;
      setTimeout(() => this.ajouteMsg = false, 2000);
    }
  }

  getStars(note: number): number[] {
    return Array(Math.round(note)).fill(0);
  }
}