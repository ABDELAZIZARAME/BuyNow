import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/index';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-page">
      <h2><i class="fa fa-shopping-cart"></i> Mon Panier</h2>

      <div class="cart-container" *ngIf="items.length > 0; else empty">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of items">
            <div class="item-image">
              <img [src]="item.product.image" [alt]="item.product.nom" class="product-img" />
            </div>
            <div class="item-info">
              <h4>{{ item.product.nom }}</h4>
              <p>{{ item.product.categorie }}</p>
            </div>
            <div class="item-quantite">
              <button (click)="modifierQte(item, item.quantite - 1)">
                <i class="fa fa-minus"></i>
              </button>
              <span>{{ item.quantite }}</span>
              <button (click)="modifierQte(item, item.quantite + 1)">
                <i class="fa fa-plus"></i>
              </button>
            </div>
            <div class="item-prix">
              {{ item.product.prix * item.quantite }} MAD
            </div>
            <button class="btn-supprimer" (click)="supprimer(item.product.id)">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>

        <div class="cart-summary">
          <h3>Récapitulatif</h3>
          <div class="summary-line" *ngFor="let item of items">
            <span>{{ item.quantite }}x {{ item.product.nom }}</span>
            <span>{{ item.product.prix * item.quantite }} MAD</span>
          </div>
          <hr/>
          <div class="summary-line">
            <span>Sous-total</span>
            <span>{{ total }} MAD</span>
          </div>
          <div class="summary-line">
            <span>Livraison</span>
            <span class="gratuit">Gratuite</span>
          </div>
          <div class="summary-total">
            <span>Total</span>
            <span>{{ total }} MAD</span>
          </div>
          <a routerLink="/commande" class="btn-commander">
            <i class="fa fa-credit-card"></i> Commander
          </a>
          <a routerLink="/produits" class="btn-continuer">
            <i class="fa fa-arrow-left"></i> Continuer les achats
          </a>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-cart">
          <i class="fa fa-shopping-cart fa-4x"></i>
          <h3>Votre panier est vide</h3>
          <a routerLink="/produits" class="btn-commander">
            Découvrir nos produits
          </a>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-page { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h2 { margin-bottom: 2rem; color: #1a47b8; }
    .cart-container { display: flex; gap: 2rem; align-items: flex-start; }
    .cart-items { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
    .cart-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .item-image {
      width: 80px;
      height: 80px;
      background: #eff6ff;
      border-radius: 10px;
      overflow: hidden;
      flex-shrink: 0;
    }
    .product-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .item-info { flex: 1; }
    .item-info h4 { margin-bottom: 0.25rem; }
    .item-info p { color: #888; font-size: 0.85rem; }
    .item-quantite {
      display: flex;
      align-items: center;
      gap: 0;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .item-quantite button { padding: 0.5rem 0.75rem; border: none; background: white; cursor: pointer; }
    .item-quantite span { padding: 0.5rem 1rem; border-left: 1px solid #ddd; border-right: 1px solid #ddd; }
    .item-prix { font-weight: 700; color: #1a47b8; min-width: 100px; text-align: right; }
    .btn-supprimer { background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.1rem; }
    .cart-summary {
      width: 300px;
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .cart-summary h3 { margin-bottom: 1.5rem; }
    .summary-line { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem; }
    hr { margin: 1rem 0; border: none; border-top: 1px solid #eee; }
    .gratuit { color: #1a47b8; font-weight: 600; }
    .summary-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; margin: 1rem 0 1.5rem; }
    .btn-commander {
      display: block;
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2563eb, #0d2b6e);
      color: white;
      text-align: center;
      border-radius: 10px;
      text-decoration: none;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }
    .btn-commander:hover { opacity: 0.9; }
    .btn-continuer {
      display: block;
      text-align: center;
      color: #1a47b8;
      text-decoration: none;
      font-size: 0.9rem;
    }
    .empty-cart { text-align: center; padding: 4rem; color: #888; }
    .empty-cart i { margin-bottom: 1rem; display: block; }
    .empty-cart h3 { margin-bottom: 1.5rem; }
  `]
})
export class CartComponent implements OnInit {
  items: CartItem[] = [];
  total = 0;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
    });
  }

  modifierQte(item: CartItem, qte: number) {
    this.cartService.modifierQuantite(item.product.id, qte);
  }

  supprimer(id: number) {
    this.cartService.supprimer(id);
  }
}