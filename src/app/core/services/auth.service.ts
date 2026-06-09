import { Injectable, signal, computed, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthUser } from '../models/index';
import { UserService } from './user.service';

const MOCK_USERS: AuthUser[] = [
  {
    id: 1,
    nom: 'Admin',
    prenom: 'ShopNow',
    email: 'admin@shopnow.ma',
    password: 'admin123',
    role: 'admin',
    actif: true,
    dateInscription: new Date('2024-01-01'),
    points: 0,
    reductions: []
  },
  {
    id: 2,
    nom: 'Alaoui',
    prenom: 'Sana',
    email: 'sana@example.com',
    password: 'user123',
    role: 'user',
    actif: true,
    dateInscription: new Date('2024-03-15'),
    points: 250,
    reductions: [
      { code: 'BIENVENUE10', valeur: 10, type: 'pourcentage', utilisee: false },
      { code: 'FIDELITE20', valeur: 20, type: 'pourcentage', utilisee: false }
    ]
  },
  {
    id: 3,
    nom: 'Benali',
    prenom: 'Youssef',
    email: 'youssef@example.com',
    password: 'user456',
    role: 'user',
    actif: true,
    dateInscription: new Date('2024-06-01'),
    points: 80,
    reductions: [
      { code: 'BIENVENUE10', valeur: 10, type: 'pourcentage', utilisee: false }
    ]
  }
];

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSignal = signal<AuthUser | null>(null);

  currentUser = this.currentUserSignal.asReadonly();
  isLoggedIn = computed(() => this.currentUserSignal() !== null);
  isAdmin = computed(() => this.currentUserSignal()?.role === 'admin');
  isUser = computed(() => this.currentUserSignal()?.role === 'user');
  isGuest = computed(() => this.currentUserSignal() === null);

  constructor(
    private router: Router,
    private userService: UserService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('shopnow_user');
      if (saved) {
        try {
          const user = JSON.parse(saved) as AuthUser;
          this.currentUserSignal.set(user);
        } catch {
          localStorage.removeItem('shopnow_user');
        }
      }
    }
  }

  login(email: string, password: string): { success: boolean; message: string } {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);

    if (!user) return { success: false, message: 'Email ou mot de passe incorrect.' };
    if (!user.actif) return { success: false, message: 'Compte désactivé. Contactez le support.' };

    this.currentUserSignal.set(user);
    const { password: _, ...safeUser } = user;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shopnow_user', JSON.stringify(safeUser));
    }
    return { success: true, message: `Bienvenue, ${user.prenom} !` };
  }

  register(nom: string, prenom: string, email: string, password: string): { success: boolean; message: string } {
    const exists = MOCK_USERS.find(u => u.email === email);
    if (exists) return { success: false, message: 'Cet email est déjà utilisé.' };

    const newUser: AuthUser = {
      id: MOCK_USERS.length + 1,
      nom, prenom, email, password,
      role: 'user',
      actif: true,
      dateInscription: new Date(),
      points: 0,
      reductions: [{ code: 'BIENVENUE10', valeur: 10, type: 'pourcentage', utilisee: false }]
    };

    MOCK_USERS.push(newUser);
    this.userService.ajouter({
      id: newUser.id, nom: newUser.nom, prenom: newUser.prenom,
      email: newUser.email, role: 'user', actif: true, dateInscription: newUser.dateInscription
    });

    this.currentUserSignal.set(newUser);
    const { password: _, ...safeUser } = newUser;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shopnow_user', JSON.stringify(safeUser));
    }
    return { success: true, message: `Compte créé ! Bienvenue, ${prenom} !` };
  }

  logout(): void {
    this.currentUserSignal.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('shopnow_user');
    }
    this.router.navigate(['/produits']);
  }

  appliquerReduction(code: string, total: number): { valide: boolean; nouveauTotal: number; message: string } {
    const user = this.currentUserSignal();
    if (!user || user.role !== 'user') {
      return { valide: false, nouveauTotal: total, message: 'Connectez-vous pour utiliser un code de réduction.' };
    }

    const reduction = user.reductions?.find(r => r.code === code && !r.utilisee);
    if (!reduction) {
      return { valide: false, nouveauTotal: total, message: 'Code invalide ou déjà utilisé.' };
    }

    const montantReduit = reduction.type === 'pourcentage'
      ? total * (1 - reduction.valeur / 100)
      : total - reduction.valeur;

    reduction.utilisee = true;
    this.currentUserSignal.set({ ...user });
    return { valide: true, nouveauTotal: Math.max(0, montantReduit), message: `Réduction de ${reduction.valeur}${reduction.type === 'pourcentage' ? '%' : ' MAD'} appliquée !` };
  }

  // ✅ +5 points par produit commandé (nbProduits = nombre total d'articles)
  ajouterPoints(nbProduits: number): void {
    const user = this.currentUserSignal();
    if (!user || user.role !== 'user') return;

    const pointsGagnes = nbProduits * 5;

    const updatedUser = { ...user, points: (user.points || 0) + pointsGagnes };
    this.currentUserSignal.set(updatedUser);

    const { password: _, ...safeUser } = updatedUser as any;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shopnow_user', JSON.stringify(safeUser));
    }
  }

  // ✅ Utiliser des points : 5 pts = 5% de réduction
  utiliserPoints(pointsAUtiliser: number, total: number): { nouveauTotal: number; message: string } {
    const user = this.currentUserSignal();
    if (!user || user.role !== 'user') {
      return { nouveauTotal: total, message: 'Non connecté.' };
    }

    const pointsDisponibles = user.points || 0;
    const pointsUtilises = Math.min(pointsAUtiliser, pointsDisponibles);
    const reductionPourcentage = pointsUtilises; // 5 pts = 5%
    const nouveauTotal = total * (1 - reductionPourcentage / 100);

    const updatedUser = { ...user, points: pointsDisponibles - pointsUtilises };
    this.currentUserSignal.set(updatedUser);

    const { password: _, ...safeUser } = updatedUser as any;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('shopnow_user', JSON.stringify(safeUser));
    }

    return {
      nouveauTotal: Math.max(0, nouveauTotal),
      message: `${pointsUtilises} points utilisés → -${reductionPourcentage}% appliqué !`
    };
  }

  getAllUsers(): AuthUser[] {
    return MOCK_USERS;
  }
}