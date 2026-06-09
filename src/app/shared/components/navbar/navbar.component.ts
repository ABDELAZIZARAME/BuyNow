import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <nav class="navbar">

      <!-- Brand -->
      <div class="navbar-brand">
        <a routerLink="/produits">
          <div class="brand-logo-wrapper">
            <img src="image.png" alt="BuyNow logo" class="brand-img" />
          </div>
          <span class="brand-name">Buy<span class="brand-accent">Now</span></span>
        </a>
      </div>

      <!-- Links -->
      <div class="navbar-links">

        @if (authService.isGuest()) {
          <a routerLink="/login" class="btn-login">
            <i class="fa fa-right-to-bracket"></i> Se connecter
          </a>
        }

        @if (authService.isLoggedIn()) {
          <div class="user-menu" (click)="toggleUserMenu()">
            <div class="user-avatar">
              {{ authService.currentUser()?.prenom?.charAt(0) }}{{ authService.currentUser()?.nom?.charAt(0) }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ authService.currentUser()?.prenom }}</span>
              @if (authService.isUser()) {
                <span class="user-points">
                  <i class="fa fa-star"></i> {{ authService.currentUser()?.points || 0 }} pts
                </span>
              }
            </div>
            <i class="fa fa-chevron-down chevron" [class.rotated]="showUserMenu()"></i>

            @if (showUserMenu()) {
              <div class="dropdown" (click)="$event.stopPropagation()">
                @if (authService.isUser()) {
                  <a routerLink="/compte" class="dropdown-item" (click)="showUserMenu.set(false)">
                    <i class="fa fa-user"></i> Mon compte
                  </a>
                  <a routerLink="/compte" class="dropdown-item" (click)="showUserMenu.set(false)">
                    <i class="fa fa-gift"></i> Mes réductions
                    <span class="badge-count">{{ getActiveReductions() }}</span>
                  </a>
                  <a routerLink="/compte" class="dropdown-item" (click)="showUserMenu.set(false)">
                    <i class="fa fa-box"></i> Mes commandes
                  </a>
                  <div class="dropdown-divider"></div>
                }
                @if (authService.isAdmin()) {
                  <a routerLink="/admin" class="dropdown-item admin-item" (click)="showUserMenu.set(false)">
                    <i class="fa fa-shield"></i> Panel Admin
                  </a>
                  <div class="dropdown-divider"></div>
                }
                <button class="dropdown-item logout-item" (click)="logout()">
                  <i class="fa fa-right-from-bracket"></i> Se déconnecter
                </button>
              </div>
            }
          </div>
        }

        <!-- Panier -->
        <a routerLink="/panier" class="cart-link">
          <i class="fa fa-shopping-cart"></i>
          <span class="cart-badge" *ngIf="cartCount > 0">{{ cartCount }}</span>
        </a>

      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: linear-gradient(135deg, #0d2b6e 0%, #1a47b8 60%, #2563eb 100%);
      padding: 0 1.75rem;
      height: 66px;
      gap: 1.5rem;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 16px rgba(0,0,0,0.2);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }

    /* ── Brand ── */
    .navbar-brand a {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      flex-shrink: 0;
    }
    .brand-logo-wrapper {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      overflow: hidden;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
      flex-shrink: 0;
    }
    .brand-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .brand-name {
      color: white;
      font-size: 1.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
    }
    .brand-accent {
      color: #f59e0b;
    }

    /* ── Links ── */
    .navbar-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }

    .btn-login {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(255,255,255,0.15);
      color: white;
      padding: 0.45rem 1rem;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 500;
      border: 1px solid rgba(255,255,255,0.25);
      transition: background 0.2s;
      text-decoration: none;
    }
    .btn-login:hover { background: rgba(255,255,255,0.25); }

    /* ── User menu ── */
    .user-menu {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      padding: 0.4rem 0.8rem;
      border-radius: 10px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      transition: background 0.2s;
      user-select: none;
    }
    .user-menu:hover { background: rgba(255,255,255,0.18); }
    .user-avatar {
      width: 32px;
      height: 32px;
      background: #f59e0b;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }
    .user-name {
      color: white;
      font-size: 0.88rem;
      font-weight: 600;
      line-height: 1;
    }
    .user-points {
      color: #fde68a;
      font-size: 0.72rem;
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .user-points i { font-size: 0.65rem; }
    .chevron {
      color: rgba(255,255,255,0.6);
      font-size: 0.7rem;
      transition: transform 0.25s;
    }
    .chevron.rotated { transform: rotate(180deg); }

    /* ── Dropdown ── */
    .dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border-radius: 14px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.18);
      padding: 0.5rem;
      min-width: 210px;
      border: 1px solid #e2e8f0;
      z-index: 999;
      animation: dropIn 0.2s ease;
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      font-size: 0.88rem;
      color: #374151;
      text-decoration: none;
      cursor: pointer;
      transition: background 0.15s;
      background: none;
      border: none;
      width: 100%;
      text-align: left;
    }
    .dropdown-item:hover { background: #f8fafc; color: #1a47b8; }
    .dropdown-item i { width: 16px; color: #64748b; }
    .dropdown-item:hover i { color: #1a47b8; }
    .admin-item { color: #1a47b8; font-weight: 600; }
    .admin-item i { color: #1a47b8; }
    .logout-item { color: #dc2626; }
    .logout-item:hover { background: #fef2f2; color: #dc2626; }
    .logout-item i { color: #dc2626; }
    .dropdown-divider { height: 1px; background: #f1f5f9; margin: 0.4rem 0; }
    .badge-count {
      margin-left: auto;
      background: #1a47b8;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
    }

    /* ── Cart ── */
    .cart-link {
      position: relative;
      color: white;
      text-decoration: none;
      background: rgba(255,255,255,0.12);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 10px;
      padding: 0.5rem 0.8rem;
      font-size: 1.1rem;
      transition: background 0.2s;
    }
    .cart-link:hover { background: rgba(255,255,255,0.22); }
    .cart-badge {
      position: absolute;
      top: -7px;
      right: -7px;
      background: #f59e0b;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #1a47b8;
    }
  `]
})
export class NavbarComponent implements OnInit {
  cartCount = 0;
  showUserMenu = signal(false);

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.cartCount = items.reduce((sum, i) => sum + i.quantite, 0);
    });
  }

  toggleUserMenu() {
    this.showUserMenu.update(v => !v);
  }

  getActiveReductions(): number {
    return this.authService.currentUser()?.reductions?.filter(r => !r.utilisee).length || 0;
  }

  logout() {
    this.showUserMenu.set(false);
    this.authService.logout();
  }
}