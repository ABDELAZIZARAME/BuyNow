import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/index';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private items: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>([]);

  cart$ = this.cartSubject.asObservable();

  ajouter(product: Product, quantite = 1): void {
    const existing = this.items.find(i => i.product.id === product.id);
    if (existing) {
      existing.quantite += quantite;
    } else {
      this.items.push({ product, quantite });
    }
    this.cartSubject.next([...this.items]);
  }

  supprimer(productId: number): void {
    this.items = this.items.filter(i => i.product.id !== productId);
    this.cartSubject.next([...this.items]);
  }

  modifierQuantite(productId: number, quantite: number): void {
    if (quantite <= 0) {
      this.supprimer(productId);
      return;
    }
    this.items = this.items.map(i =>
      i.product.id === productId ? { ...i, quantite } : i
    );
    this.cartSubject.next([...this.items]);
  }

  vider(): void {
    this.items = [];
    this.cartSubject.next([]);
  }

  getTotal(): number {
    return this.items.reduce((sum, i) => sum + i.product.prix * i.quantite, 0);
  }

  getNombreItems(): number {
    return this.items.reduce((sum, i) => sum + i.quantite, 0);
  }
}
