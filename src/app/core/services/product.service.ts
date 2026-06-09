import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Product } from '../models/product.model';
import { PRODUCTS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private products: Product[] = [...PRODUCTS];
  private productsSubject = new BehaviorSubject<Product[]>(this.products);

  // 🔥 CACHE pour éviter recalculs
  private cacheById = new Map<number, Product>();

  constructor() {
    this.products.forEach(p => this.cacheById.set(p.id, p));
  }

  getAll(): Observable<Product[]> {
    return this.productsSubject.asObservable();
  }

  getById(id: number): Observable<Product | undefined> {
    return of(this.cacheById.get(id));
  }

  getCategories(): string[] {
    return [...new Set(this.products.map(p => p.categorie))];
  }

  filtrer(search: string, categorie: string, prixMin: number, prixMax: number): Product[] {

    const s = (search || '').toLowerCase();

    return this.products.filter(p => {

      const matchSearch =
        p.nom.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s);

      const matchCat = !categorie || p.categorie === categorie;
      const matchPrix = p.prix >= prixMin && p.prix <= prixMax;

      return matchSearch && matchCat && matchPrix;
    });
  }

  ajouter(product: Omit<Product, 'id'>): void {
    const newProduct = { ...product, id: Date.now() };

    this.products.push(newProduct);
    this.cacheById.set(newProduct.id, newProduct);

    this.productsSubject.next([...this.products]);
  }

  modifier(id: number, changes: Partial<Product>): void {

    this.products = this.products.map(p =>
      p.id === id ? { ...p, ...changes } : p
    );

    const updated = this.products.find(p => p.id === id);
    if (updated) this.cacheById.set(id, updated);

    this.productsSubject.next([...this.products]);
  }

  supprimer(id: number): void {

    this.products = this.products.filter(p => p.id !== id);
    this.cacheById.delete(id);

    this.productsSubject.next([...this.products]);
  }
}