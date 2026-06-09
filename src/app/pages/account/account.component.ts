import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { Order, AuthUser } from '../../core/models/index';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="account-page">
      <div class="account-hero">
        <div class="hero-bg"></div>
        <div class="hero-content">
          <div class="avatar-large">
            {{ user?.prenom?.charAt(0) }}{{ user?.nom?.charAt(0) }}
          </div>
          <div class="user-info">
            <h1>{{ user?.prenom }} {{ user?.nom }}</h1>
            <p>{{ user?.email }}</p>
            <span class="role-badge">
              <i class="fa fa-user-check"></i> Membre depuis {{ user?.dateInscription | date:'MMMM yyyy' }}
            </span>
          </div>
          <div class="points-card">
            <div class="points-value">{{ authService.currentUser()?.points || 0 }}</div>
            <div class="points-label"><i class="fa fa-star"></i> Points fidélité</div>
            <div class="points-hint">5 pts par produit commandé</div>
          </div>
        </div>
      </div>

      <div class="account-body">
        <!-- Codes de réduction -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fa fa-gift"></i> Mes codes de réduction</h2>
            <span class="count-badge">{{ activeReductions }} actifs</span>
          </div>
          @if (user && user.reductions && user.reductions.length > 0) {
            <div class="reductions-grid">
              @for (r of user.reductions; track r.code) {
                <div class="reduction-chip" [class.used]="r.utilisee">
                  <div class="reduction-code">{{ r.code }}</div>
                  <div class="reduction-value">
                    -{{ r.valeur }}{{ r.type === 'pourcentage' ? '%' : ' MAD' }}
                  </div>
                  <div class="reduction-status">
                    @if (r.utilisee) {
                      <span class="status-used"><i class="fa fa-check"></i> Utilisé</span>
                    } @else {
                      <span class="status-active"><i class="fa fa-circle"></i> Disponible</span>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <i class="fa fa-ticket fa-2x"></i>
              <p>Aucun code de réduction pour le moment</p>
            </div>
          }
        </div>

        <!-- Commandes -->
        <div class="section-card">
          <div class="section-header">
            <h2><i class="fa fa-box"></i> Mes commandes</h2>
            <span class="count-badge">{{ orders.length }}</span>
          </div>

          @if (orders.length > 0) {
            <div class="orders-list">
              @for (order of orders; track order.id) {
                <div class="order-card">
                  <div class="order-header">
                    <div class="order-id">
                      <i class="fa fa-hashtag"></i> {{ order.id }}
                    </div>
                    <span class="status-badge" [class]="'status-' + order.statut">
                      {{ getStatutLabel(order.statut) }}
                    </span>
                    <div class="order-date">
                      <i class="fa fa-calendar"></i> {{ order.date | date:'dd/MM/yyyy' }}
                    </div>
                    <div class="order-total">{{ order.total }} MAD</div>
                  </div>
                  <div class="order-items">
                    @for (item of order.items; track item.product.id) {
                      <span class="item-tag">{{ item.quantite }}× {{ item.product.nom }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="empty-state">
              <i class="fa fa-box-open fa-2x"></i>
              <p>Aucune commande passée</p>
              <a routerLink="/produits" class="btn-shop">
                <i class="fa fa-store"></i> Commencer vos achats
              </a>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-page { background: #f8fafc; min-height: 100vh; }

    /* ── Hero : vert → bleu ── */
    .account-hero {
      position: relative; overflow: hidden;
      background: linear-gradient(135deg, #0d2b6e 0%, #1a47b8 60%, #2563eb 100%);
      padding: 3rem 2rem;
    }
    .hero-bg {
      position: absolute; inset: 0;
      background: radial-gradient(circle at 70% 50%, rgba(245,158,11,0.15) 0%, transparent 60%);
    }
    .hero-content {
      position: relative; max-width: 1000px; margin: auto;
      display: flex; align-items: center; gap: 2rem; flex-wrap: wrap;
    }
    .avatar-large {
      width: 80px; height: 80px; background: #f59e0b; border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem; font-weight: 800; color: white;
      box-shadow: 0 8px 24px rgba(245,158,11,0.4); flex-shrink: 0;
    }
    .user-info { flex: 1; }
    .user-info h1 { color: white; font-size: 1.8rem; font-weight: 700; margin-bottom: 0.25rem; }
    .user-info p { color: rgba(255,255,255,0.7); margin-bottom: 0.5rem; }
    .role-badge {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.9);
      padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.8rem;
    }
    .points-card {
      background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px; padding: 1.5rem 2rem; text-align: center; min-width: 150px;
    }
    .points-value { font-size: 2.5rem; font-weight: 800; color: #f59e0b; line-height: 1; }
    .points-label { color: white; font-weight: 600; margin: 0.3rem 0; display: flex; align-items: center; justify-content: center; gap: 0.3rem; }
    .points-label i { color: #f59e0b; }
    .points-hint { color: rgba(255,255,255,0.5); font-size: 0.75rem; }

    /* ── Body ── */
    .account-body { max-width: 1000px; margin: 2rem auto; padding: 0 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .section-card {
      background: white; border-radius: 18px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      padding: 1.75rem; border: 1px solid #f1f5f9;
    }
    .section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
    .section-header h2 { font-size: 1.1rem; font-weight: 700; color: #1e293b; display: flex; align-items: center; gap: 0.5rem; }
    .section-header h2 i { color: #1a47b8; }

    /* ── Badge count : vert → bleu ── */
    .count-badge {
      background: #eff6ff; color: #1e40af; padding: 0.2rem 0.6rem;
      border-radius: 20px; font-size: 0.8rem; font-weight: 600; margin-left: auto;
    }

    /* ── Réductions : vert → bleu ── */
    .reductions-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
    .reduction-chip {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      border: 1.5px dashed #1a47b8; border-radius: 12px;
      padding: 1rem 1.25rem; min-width: 160px; transition: transform 0.2s;
    }
    .reduction-chip:hover { transform: translateY(-2px); }
    .reduction-chip.used { background: #f8fafc; border-color: #cbd5e1; opacity: 0.6; }
    .reduction-code { font-weight: 700; font-size: 1rem; color: #1e293b; letter-spacing: 0.05em; }
    .reduction-value { font-size: 1.5rem; font-weight: 800; color: #1a47b8; }
    .reduction-chip.used .reduction-value { color: #94a3b8; }
    .status-used { color: #94a3b8; font-size: 0.8rem; }
    .status-active { color: #1a47b8; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; }
    .status-active i { font-size: 0.5rem; }

    /* ── Commandes ── */
    .orders-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .order-card { border: 1px solid #f1f5f9; border-radius: 12px; padding: 1rem 1.25rem; transition: box-shadow 0.2s; }
    .order-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
    .order-header { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
    .order-id { font-weight: 700; color: #374151; display: flex; align-items: center; gap: 0.3rem; }
    .order-id i { color: #94a3b8; font-size: 0.75rem; }
    .order-date, .order-total { color: #64748b; font-size: 0.88rem; display: flex; align-items: center; gap: 0.3rem; }
    .order-total { margin-left: auto; font-weight: 700; color: #1a47b8; font-size: 1rem; }
    .status-badge { padding: 0.3rem 0.75rem; border-radius: 20px; font-size: 0.78rem; font-weight: 600; }
    .status-livree { background: #dcfce7; color: #166534; }
    .status-livraison { background: #dbeafe; color: #1e40af; }
    .status-confirmee { background: #fef9c3; color: #854d0e; }
    .status-en-attente { background: #f3f4f6; color: #374151; }
    .status-annulee { background: #fee2e2; color: #991b1b; }
    .order-items { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .item-tag {
      background: #f8fafc; border: 1px solid #e2e8f0;
      padding: 0.25rem 0.6rem; border-radius: 6px; font-size: 0.82rem; color: #475569;
    }
    .empty-state {
      text-align: center; padding: 2.5rem; color: #94a3b8;
      display: flex; flex-direction: column; align-items: center; gap: 1rem;
    }
    .btn-shop {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: #1a47b8; color: white; padding: 0.65rem 1.5rem;
      border-radius: 10px; font-weight: 600; text-decoration: none; font-size: 0.9rem;
    }
  `]
})
export class AccountComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  user: AuthUser | null = null;
  private sub!: Subscription;

  constructor(
    private orderService: OrderService,
    public authService: AuthService
  ) {}

  get activeReductions(): number {
    if (!this.user || !this.user.reductions) return 0;
    return this.user.reductions.filter(r => !r.utilisee).length;
  }

  getStatutLabel(statut: string): string {
    const labels: Record<string, string> = {
      'en-attente': '⏳ En attente',
      'confirmee': '✅ Confirmée',
      'livraison': '🚚 En livraison',
      'livree': '📦 Livrée',
      'annulee': '❌ Annulée'
    };
    return labels[statut] || statut;
  }

  ngOnInit() {
    this.user = this.authService.currentUser();
    if (this.user) {
      this.sub = this.orderService.orders$.subscribe(allOrders => {
        this.orders = allOrders.filter(o => o.userId === this.user!.id);
      });
    }
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}