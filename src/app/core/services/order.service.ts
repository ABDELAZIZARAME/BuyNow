import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, Adresse, CartItem } from '../models/index';
import { ORDERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private orders: Order[] = [...ORDERS];
  private ordersSubject = new BehaviorSubject<Order[]>(this.orders);

  orders$ = this.ordersSubject.asObservable();

  getAll(): Observable<Order[]> {
    return this.ordersSubject.asObservable();
  }

  getByUserId(userId: number): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  creerCommande(items: CartItem[], adresse: Adresse, userId = 2): Order {
    const newOrder: Order = {
      id: 1000 + this.orders.length + 1,
      userId,
      items: [...items],
      total: items.reduce((sum, i) => sum + i.product.prix * i.quantite, 0),
      statut: 'en-attente',
      date: new Date(),
      adresse
    };
    this.orders.push(newOrder);
    this.ordersSubject.next([...this.orders]);
    return newOrder;
  }

  changerStatut(id: number, statut: Order['statut']): void {
    this.orders = this.orders.map(o => o.id === id ? { ...o, statut } : o);
    this.ordersSubject.next([...this.orders]);
  }

  supprimer(id: number): void {
    this.orders = this.orders.filter(o => o.id !== id);
    this.ordersSubject.next([...this.orders]);
  }
}
