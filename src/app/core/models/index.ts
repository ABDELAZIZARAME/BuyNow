import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantite: number;
}

export interface Order {
  id: number;
  userId: number;
  items: CartItem[];
  total: number;
  statut: 'en-attente' | 'confirmee' | 'livraison' | 'livree' | 'annulee';
  date: Date;
  adresse: Adresse;
}

export interface Adresse {
  nom: string;
  prenom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
}

export interface Reduction {
  code: string;
  valeur: number;
  type: 'pourcentage' | 'fixe';
  utilisee: boolean;
}

/** Utilisateur de base (affiché dans admin) */
export interface User {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'user' | 'guest' | 'client';
  dateInscription: Date;
  actif: boolean;
}

/** Utilisateur authentifié (avec données sensibles) */
export interface AuthUser extends User {
  password?: string;
  points: number;
  reductions: Reduction[];
}