import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { CartItem, Adresse } from '../../core/models/index';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checkout-page">
      <h2>Tunnel de commande</h2>

      <!-- Stepper -->
      <div class="stepper">
        <div class="step" [class.active]="etape >= 1" [class.done]="etape > 1">
          <div class="step-circle">
            <i class="fa fa-check" *ngIf="etape > 1"></i>
            <span *ngIf="etape <= 1">1</span>
          </div>
          <span>Panier</span>
        </div>
        <div class="step-line" [class.active]="etape > 1"></div>
        <div class="step" [class.active]="etape >= 2">
          <div class="step-circle">
            <i class="fa fa-check" *ngIf="etape > 2"></i>
            <span *ngIf="etape <= 2">2</span>
          </div>
          <span>Livraison</span>
        </div>
        <div class="step-line" [class.active]="etape > 2"></div>
        <div class="step" [class.active]="etape >= 3">
          <div class="step-circle">3</div>
          <span>Paiement</span>
        </div>
      </div>

      <div class="checkout-container">

        <!-- Étape 1 : Panier -->
        <div class="checkout-form" *ngIf="etape === 1">
          <h3>Votre panier</h3>
          <div class="panier-item" *ngFor="let item of items">
            <img [src]="item.product.image" [alt]="item.product.nom" class="panier-img" />
            <span>{{ item.quantite }}x {{ item.product.nom }}</span>
            <span>{{ item.product.prix * item.quantite }} MAD</span>
          </div>
          <button class="btn-next" (click)="etape = 2">
            Continuer <i class="fa fa-arrow-right"></i>
          </button>
        </div>

        <!-- Étape 2 : Livraison -->
        <div class="checkout-form" *ngIf="etape === 2">
          <h3>Adresse de livraison</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Nom *</label>
              <input type="text" [(ngModel)]="adresse.nom" placeholder="Nom"/>
            </div>
            <div class="form-group">
              <label>Prénom *</label>
              <input type="text" [(ngModel)]="adresse.prenom" placeholder="Prénom"/>
            </div>
            <div class="form-group full">
              <label>Adresse *</label>
              <input type="text" [(ngModel)]="adresse.adresse" placeholder="Adresse complète"/>
            </div>
            <div class="form-group">
              <label>Ville *</label>
              <input type="text" [(ngModel)]="adresse.ville" placeholder="Ville"/>
            </div>
            <div class="form-group">
              <label>Code postal *</label>
              <input type="text" [(ngModel)]="adresse.codePostal" placeholder="Code postal"/>
            </div>
            <div class="form-group">
              <label>Téléphone *</label>
              <input type="tel" [(ngModel)]="adresse.telephone" placeholder="06 00 00 00 00"/>
            </div>
            <div class="form-group">
              <label>E-mail *</label>
              <input type="email" [(ngModel)]="adresse.email" placeholder="email@example.com"/>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn-prev" (click)="etape = 1"><i class="fa fa-arrow-left"></i> Retour</button>
            <button class="btn-next" (click)="etape = 3" [disabled]="!adresseValide()">
              Continuer <i class="fa fa-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Étape 3 : Paiement -->
        <div class="checkout-form" *ngIf="etape === 3">
          <h3>Paiement</h3>

          <!-- Points de fidélité -->
          <div class="points-section" *ngIf="authService.isUser() && userPoints > 0">
            <div class="points-header">
              <i class="fa fa-star"></i>
              <span>Vous avez <strong>{{ userPoints }} points</strong> de fidélité</span>
            </div>
            <div class="points-info">5 points = 5% de réduction</div>
            <div class="points-controls" *ngIf="!pointsAppliques">
              <div class="points-input-row">
                <label>Points à utiliser :</label>
                <input type="number" [(ngModel)]="pointsAUtiliser" [min]="5" [max]="userPoints" [step]="5" placeholder="0"/>
                <span class="points-reduction-preview" *ngIf="pointsAUtiliser >= 5">→ -{{ pointsAUtiliser }}%</span>
              </div>
              <button class="btn-points" (click)="appliquerPoints()" [disabled]="!pointsAUtiliser || pointsAUtiliser < 5">
                <i class="fa fa-check"></i> Utiliser mes points
              </button>
            </div>
            <div class="points-appliques" *ngIf="pointsAppliques">
              <i class="fa fa-circle-check"></i>
              {{ pointsMessage }}
              <button class="btn-annuler-points" (click)="annulerPoints()">Annuler</button>
            </div>
          </div>

          <!-- Choix du mode de paiement -->
          <div class="payment-options">
            <label class="payment-option" [class.selected]="modePaiement === 'carte'" (click)="modePaiement = 'carte'">
              <input type="radio" name="paiement" value="carte" [(ngModel)]="modePaiement"/>
              <i class="fa fa-credit-card"></i> Carte bancaire
            </label>
            <label class="payment-option" [class.selected]="modePaiement === 'virement'" (click)="modePaiement = 'virement'">
              <input type="radio" name="paiement" value="virement" [(ngModel)]="modePaiement"/>
              <i class="fa fa-building-columns"></i> Virement bancaire
            </label>
            <label class="payment-option" [class.selected]="modePaiement === 'livraison'" (click)="modePaiement = 'livraison'">
              <input type="radio" name="paiement" value="livraison" [(ngModel)]="modePaiement"/>
              <i class="fa fa-truck"></i> Paiement à la livraison
            </label>
          </div>

          <!-- ✅ Formulaire Carte bancaire -->
          <div class="payment-form" *ngIf="modePaiement === 'carte'">
            <div class="payment-form-title">
              <i class="fa fa-lock"></i> Paiement sécurisé par carte
            </div>
            <div class="card-visual">
              <div class="card-chip"></div>
              <div class="card-number-display">
                {{ carte.numero ? formatCardNumber(carte.numero) : '•••• •••• •••• ••••' }}
              </div>
              <div class="card-bottom">
                <div>
                  <div class="card-label">Titulaire</div>
                  <div>{{ carte.titulaire || 'PRENOM NOM' }}</div>
                </div>
                <div>
                  <div class="card-label">Expiration</div>
                  <div>{{ carte.expiration || 'MM/AA' }}</div>
                </div>
              </div>
            </div>
            <div class="form-grid">
              <div class="form-group full">
                <label>Numéro de carte *</label>
                <input type="text" [(ngModel)]="carte.numero" placeholder="1234 5678 9012 3456"
                  maxlength="19" (input)="formatInput($event)"/>
              </div>
              <div class="form-group full">
                <label>Titulaire de la carte *</label>
                <input type="text" [(ngModel)]="carte.titulaire" placeholder="Prénom NOM"/>
              </div>
              <div class="form-group">
                <label>Date d'expiration *</label>
                <input type="text" [(ngModel)]="carte.expiration" placeholder="MM/AA" maxlength="5"/>
              </div>
              <div class="form-group">
                <label>CVV *
                  <span class="cvv-info" title="3 chiffres au dos de la carte"><i class="fa fa-circle-question"></i></span>
                </label>
                <input type="password" [(ngModel)]="carte.cvv" placeholder="•••" maxlength="3"/>
              </div>
            </div>
          </div>

          <!-- ✅ Formulaire Virement bancaire -->
          <div class="payment-form" *ngIf="modePaiement === 'virement'">
            <div class="payment-form-title">
              <i class="fa fa-building-columns"></i> Informations de virement
            </div>
            <div class="virement-info-box">
              <p>Veuillez effectuer votre virement vers le compte suivant :</p>
              <div class="bank-details">
                <div class="bank-row">
                  <span class="bank-label">Banque</span>
                  <span class="bank-value">Attijariwafa Bank</span>
                </div>
                <div class="bank-row">
                  <span class="bank-label">Titulaire</span>
                  <span class="bank-value">ShopNow SARL</span>
                </div>
                <div class="bank-row">
                  <span class="bank-label">RIB</span>
                  <span class="bank-value copyable" (click)="copier('007 780 0001234567890123 45')">
                    007 780 0001234567890123 45 <i class="fa fa-copy"></i>
                  </span>
                </div>
                <div class="bank-row">
                  <span class="bank-label">IBAN</span>
                  <span class="bank-value copyable" (click)="copier('MA64 0078 0000 1234 5678 9012 345')">
                    MA64 0078 0000 1234 5678 9012 345 <i class="fa fa-copy"></i>
                  </span>
                </div>
                <div class="bank-row highlight">
                  <span class="bank-label">Montant</span>
                  <span class="bank-value">{{ totalFinal }} MAD</span>
                </div>
              </div>
              <p class="virement-note">
                <i class="fa fa-triangle-exclamation"></i>
                Mentionnez votre nom et prénom en référence du virement.
              </p>
            </div>
            <div class="form-group" style="margin-top:1rem">
              <label>Référence de votre virement *</label>
              <input type="text" [(ngModel)]="virement.reference" placeholder="Ex: Alaoui Sana - Commande ShopNow"/>
            </div>
            <div class="copied-msg" *ngIf="copiedMsg">
              <i class="fa fa-check"></i> Copié !
            </div>
          </div>

          <!-- ✅ Info Paiement à la livraison -->
          <div class="payment-form" *ngIf="modePaiement === 'livraison'">
            <div class="payment-form-title">
              <i class="fa fa-truck"></i> Paiement à la livraison
            </div>
            <div class="livraison-info">
              <div class="livraison-step">
                <div class="livraison-icon"><i class="fa fa-box"></i></div>
                <div>
                  <strong>Commande confirmée</strong>
                  <p>Votre commande est préparée et expédiée.</p>
                </div>
              </div>
              <div class="livraison-step">
                <div class="livraison-icon"><i class="fa fa-truck"></i></div>
                <div>
                  <strong>Livraison à domicile</strong>
                  <p>Le livreur vous contacte avant la livraison.</p>
                </div>
              </div>
              <div class="livraison-step">
                <div class="livraison-icon"><i class="fa fa-money-bill"></i></div>
                <div>
                  <strong>Paiement à la réception</strong>
                  <p>Payez <strong>{{ totalFinal }} MAD</strong> en espèces à la livraison.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="btn-group">
            <button class="btn-prev" (click)="etape = 2"><i class="fa fa-arrow-left"></i> Retour</button>
            <button class="btn-next" (click)="confirmerCommande()" [disabled]="!paiementValide()">
              <i class="fa fa-check"></i> Confirmer la commande
            </button>
          </div>
        </div>

        <!-- Succès -->
        <div class="success" *ngIf="etape === 4">
          <i class="fa fa-circle-check fa-4x"></i>
          <h3>Commande confirmée !</h3>
          <p>Commande #{{ commandeId }} passée avec succès.</p>
          <div class="points-gagnes" *ngIf="pointsGagnes > 0">
            <i class="fa fa-star"></i>
            Vous avez gagné <strong>{{ pointsGagnes }} points</strong> de fidélité !
          </div>
          <button (click)="router.navigate(['/compte'])">Voir mes commandes</button>
        </div>

        <!-- Récapitulatif -->
        <div class="recap" *ngIf="etape < 4">
          <h3>Récapitulatif</h3>
          <div class="recap-item" *ngFor="let item of items">
            <span>{{ item.quantite }}x {{ item.product.nom }}</span>
            <span>{{ item.product.prix * item.quantite }} MAD</span>
          </div>
          <hr/>
          <div class="recap-total" *ngIf="pointsAppliques">
            <span>Réduction points</span>
            <span class="reduction-text">-{{ pointsAUtiliser }}%</span>
          </div>
          <div class="recap-total">
            <span>Livraison</span>
            <span class="gratuit">Gratuite</span>
          </div>
          <div class="recap-total bold">
            <span>Total</span>
            <span>{{ totalFinal }} MAD</span>
          </div>
          <div class="recap-points-info" *ngIf="authService.isUser()">
            <i class="fa fa-star"></i> +{{ pointsAGagner }} pts après commande
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .checkout-page { max-width: 1100px; margin: 0 auto; padding: 2rem; }
    h2 { margin-bottom: 2rem; color: #1a6b4a; }
    .stepper {
      display: flex; align-items: center; margin-bottom: 2.5rem;
      background: white; padding: 1.5rem; border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .step { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .step-circle {
      width: 40px; height: 40px; border-radius: 50%; background: #eee;
      display: flex; align-items: center; justify-content: center; font-weight: 700;
    }
    .step.active .step-circle, .step.done .step-circle { background: #1a6b4a; color: white; }
    .step span { font-size: 0.85rem; color: #888; }
    .step.active span { color: #1a6b4a; font-weight: 600; }
    .step-line { flex: 1; height: 3px; background: #eee; margin: 0 0.5rem; }
    .step-line.active { background: #1a6b4a; }
    .checkout-container { display: flex; gap: 2rem; }
    .checkout-form {
      flex: 1; background: white; border-radius: 12px;
      padding: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .checkout-form h3 { margin-bottom: 1.5rem; }
    .panier-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid #eee; }
    .panier-item span:last-child { margin-left: auto; font-weight: 600; color: #1a6b4a; }
    .panier-img { width: 50px; height: 50px; object-fit: contain; border-radius: 6px; background: #f5f5f5; }

    /* Points */
    .points-section {
      background: #fffbeb; border: 1px solid #f59e0b;
      border-radius: 10px; padding: 1rem; margin-bottom: 1.5rem;
    }
    .points-header { display: flex; align-items: center; gap: 0.5rem; color: #92400e; margin-bottom: 0.25rem; }
    .points-header i { color: #f59e0b; }
    .points-info { font-size: 0.8rem; color: #a16207; margin-bottom: 0.75rem; }
    .points-controls { display: flex; flex-direction: column; gap: 0.75rem; }
    .points-input-row { display: flex; align-items: center; gap: 0.75rem; }
    .points-input-row label { font-size: 0.9rem; white-space: nowrap; }
    .points-input-row input { width: 80px; padding: 0.4rem 0.6rem; border: 1px solid #d97706; border-radius: 6px; text-align: center; }
    .points-reduction-preview { color: #d97706; font-weight: 700; }
    .btn-points { padding: 0.6rem 1.2rem; background: #f59e0b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.9rem; align-self: flex-start; }
    .btn-points:disabled { background: #ccc; cursor: not-allowed; }
    .points-appliques { display: flex; align-items: center; gap: 0.75rem; color: #15803d; font-weight: 500; }
    .btn-annuler-points { margin-left: auto; padding: 0.3rem 0.8rem; background: white; border: 1px solid #d97706; border-radius: 6px; cursor: pointer; font-size: 0.8rem; color: #92400e; }

    /* Payment options */
    .payment-options { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
    .payment-option {
      display: flex; align-items: center; gap: 1rem; padding: 1rem;
      border: 2px solid #ddd; border-radius: 10px; cursor: pointer; transition: all 0.2s;
    }
    .payment-option.selected { border-color: #1a6b4a; background: #f0faf5; }
    .payment-option input { display: none; }

    /* Payment forms */
    .payment-form {
      background: #f8fafc; border: 1px solid #e2e8f0;
      border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;
      animation: fadeIn 0.25s ease;
    }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
    .payment-form-title {
      font-weight: 600; color: #334155; margin-bottom: 1.25rem;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .payment-form-title i { color: #1a6b4a; }

    /* Carte visuelle */
    .card-visual {
      background: linear-gradient(135deg, #1a6b4a, #2d9c6e);
      border-radius: 16px; padding: 1.5rem; color: white;
      margin-bottom: 1.5rem; min-height: 140px;
      display: flex; flex-direction: column; justify-content: space-between;
      box-shadow: 0 8px 24px rgba(26,107,74,0.3);
    }
    .card-chip {
      width: 36px; height: 28px; background: #f59e0b;
      border-radius: 5px; margin-bottom: 1rem;
    }
    .card-number-display { font-size: 1.25rem; letter-spacing: 3px; font-family: monospace; margin-bottom: 1rem; }
    .card-bottom { display: flex; justify-content: space-between; }
    .card-label { font-size: 0.7rem; opacity: 0.7; text-transform: uppercase; margin-bottom: 0.2rem; }
    .cvv-info { margin-left: 0.4rem; color: #888; cursor: help; }

    /* Virement */
    .virement-info-box {
      background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1.25rem;
    }
    .virement-info-box p { color: #555; margin-bottom: 1rem; }
    .bank-details { display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1rem; }
    .bank-row { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0; border-bottom: 1px solid #f1f5f9; }
    .bank-row.highlight { background: #f0faf5; border-radius: 6px; padding: 0.5rem; margin-top: 0.25rem; }
    .bank-label { font-size: 0.8rem; color: #888; width: 80px; flex-shrink: 0; }
    .bank-value { font-weight: 500; color: #1e293b; }
    .bank-value.copyable { cursor: pointer; color: #1a6b4a; display: flex; align-items: center; gap: 0.4rem; }
    .bank-value.copyable:hover { text-decoration: underline; }
    .virement-note { font-size: 0.85rem; color: #d97706; display: flex; align-items: center; gap: 0.4rem; margin-bottom: 0 !important; }
    .copied-msg { color: #1a6b4a; font-size: 0.85rem; margin-top: 0.5rem; }

    /* Livraison steps */
    .livraison-info { display: flex; flex-direction: column; gap: 1rem; }
    .livraison-step { display: flex; align-items: flex-start; gap: 1rem; }
    .livraison-icon {
      width: 44px; height: 44px; background: #e8f5ee; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      color: #1a6b4a; flex-shrink: 0; font-size: 1.1rem;
    }
    .livraison-step strong { display: block; margin-bottom: 0.2rem; }
    .livraison-step p { color: #666; font-size: 0.9rem; margin: 0; }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-group.full { grid-column: 1 / -1; }
    .form-group label { font-size: 0.85rem; font-weight: 500; }
    .form-group input {
      padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px;
      outline: none; font-size: 0.95rem; background: white;
    }
    .form-group input:focus { border-color: #1a6b4a; }

    .btn-group { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .btn-next { flex: 1; padding: 1rem; background: #1a6b4a; color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 1rem; }
    .btn-next:disabled { background: #ccc; cursor: not-allowed; }
    .btn-prev { padding: 1rem 1.5rem; border: 1px solid #ddd; background: white; border-radius: 10px; cursor: pointer; }

    .recap {
      width: 280px; background: white; border-radius: 12px;
      padding: 1.5rem; height: fit-content; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .recap h3 { margin-bottom: 1rem; }
    .recap-item { display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.9rem; }
    hr { margin: 1rem 0; border: none; border-top: 1px solid #eee; }
    .recap-total { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
    .recap-total.bold { font-weight: 700; font-size: 1.1rem; }
    .gratuit { color: #1a6b4a; font-weight: 600; }
    .reduction-text { color: #d97706; font-weight: 600; }
    .recap-points-info {
      margin-top: 0.75rem; padding: 0.5rem; background: #fffbeb;
      border-radius: 6px; font-size: 0.8rem; color: #92400e;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .recap-points-info i { color: #f59e0b; }

    .success { text-align: center; padding: 3rem; flex: 1; background: white; border-radius: 12px; }
    .success i { color: #1a6b4a; margin-bottom: 1rem; display: block; }
    .success button { margin-top: 1.5rem; padding: 0.75rem 2rem; background: #1a6b4a; color: white; border: none; border-radius: 10px; cursor: pointer; }
    .points-gagnes {
      margin: 1rem auto; padding: 0.75rem 1.5rem; background: #fffbeb;
      border-radius: 8px; color: #92400e; display: inline-flex; align-items: center; gap: 0.5rem;
    }
    .points-gagnes i { color: #f59e0b; }
  `]
})
export class CheckoutComponent implements OnInit {
  etape = 1;
  items: CartItem[] = [];
  total = 0;
  totalFinal = 0;
  commandeId = 0;
  modePaiement = 'carte';
  pointsGagnes = 0;
  copiedMsg = false;

  // Points
  pointsAUtiliser = 0;
  pointsAppliques = false;
  pointsMessage = '';

  // Données carte
  carte = { numero: '', titulaire: '', expiration: '', cvv: '' };

  // Données virement
  virement = { reference: '' };

  adresse: Adresse = {
    nom: '', prenom: '', adresse: '',
    ville: '', codePostal: '', telephone: '', email: ''
  };

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    public authService: AuthService,
    public router: Router
  ) {}

  ngOnInit() {
    this.cartService.cart$.subscribe(items => {
      this.items = items;
      this.total = this.cartService.getTotal();
      this.totalFinal = this.total;
    });
  }

  get userPoints(): number { return this.authService.currentUser()?.points || 0; }
  get nbProduitsTotal(): number { return this.items.reduce((sum, i) => sum + i.quantite, 0); }
  get pointsAGagner(): number { return this.nbProduitsTotal * 5; }

  // Formate le numéro de carte avec espaces (ex: 1234 5678 9012 3456)
  formatCardNumber(value: string): string {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  }

  formatInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    this.carte.numero = val.replace(/(.{4})/g, '$1 ').trim();
  }

  copier(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedMsg = true;
      setTimeout(() => this.copiedMsg = false, 2000);
    });
  }

  appliquerPoints() {
    if (this.pointsAUtiliser < 5) return;
    const result = this.authService.utiliserPoints(this.pointsAUtiliser, this.total);
    this.totalFinal = Math.round(result.nouveauTotal);
    this.pointsAppliques = true;
    this.pointsMessage = result.message;
  }

  annulerPoints() {
    this.totalFinal = this.total;
    this.pointsAppliques = false;
    this.pointsAUtiliser = 0;
    this.pointsMessage = '';
  }

  adresseValide(): boolean {
    return !!(this.adresse.nom && this.adresse.prenom &&
              this.adresse.adresse && this.adresse.ville &&
              this.adresse.email && this.adresse.telephone);
  }

  paiementValide(): boolean {
    if (this.modePaiement === 'carte') {
      return !!(this.carte.numero && this.carte.titulaire &&
                this.carte.expiration && this.carte.cvv);
    }
    if (this.modePaiement === 'virement') {
      return !!this.virement.reference;
    }
    return true; // livraison : toujours valide
  }

  confirmerCommande() {
    const order = this.orderService.creerCommande(this.items, this.adresse);
    this.commandeId = order.id;
    this.pointsGagnes = this.nbProduitsTotal * 5;
    this.authService.ajouterPoints(this.nbProduitsTotal);
    this.cartService.vider();
    this.etape = 4;
  }
}