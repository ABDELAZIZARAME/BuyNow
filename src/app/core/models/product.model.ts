export interface Product {
  id: number;
  nom: string;
  description: string;
  prix: number;
  prixOriginal?: number;
  categorie: string;
  sousCategorie: string;
  marque: string;
  image: string;
  images?: string[];
  disponible: boolean;
  stock: number;
  reduction?: number;
  badge?: 'nouveau' | 'stock-bas' | 'promo';
  note: number;
  avis: number;
}
