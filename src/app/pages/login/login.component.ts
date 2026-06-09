import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-container">

        <!-- Left side: branding -->
        <div class="login-brand">
          <div class="brand-logo-big">
            <img src="image.png" alt="BuyNow logo" />
          </div>
          <h1>ShopNow</h1>
          <p>La meilleure expérience shopping en ligne au Maroc</p>
          <div class="brand-features">
            <div class="feature"><i class="fa fa-tag"></i> Réductions exclusives pour membres</div>
            <div class="feature"><i class="fa fa-star"></i> Programme de fidélité & points</div>
            <div class="feature"><i class="fa fa-shield-halved"></i> Paiement sécurisé garanti</div>
            <div class="feature"><i class="fa fa-truck"></i> Livraison rapide partout au Maroc</div>
          </div>
          <a routerLink="/produits" class="guest-btn">
            <i class="fa fa-store"></i> Continuer en tant que visiteur
          </a>
        </div>

        <!-- Right side: form -->
        <div class="login-form-side">
          <div class="tabs">
            <button [class.active]="mode() === 'login'" (click)="mode.set('login')">
              Se connecter
            </button>
            <button [class.active]="mode() === 'register'" (click)="mode.set('register')">
              Créer un compte
            </button>
          </div>

          <!-- LOGIN FORM -->
          @if (mode() === 'login') {
            <form class="auth-form" (ngSubmit)="onLogin()">
              <h2>Bienvenue !</h2>
              <p class="subtitle">Connectez-vous à votre compte</p>

              <div class="field">
                <label>Email</label>
                <div class="input-wrap">
                  <i class="fa fa-envelope"></i>
                  <input type="email" [(ngModel)]="loginEmail" name="email"
                    placeholder="votre@email.com" required />
                </div>
              </div>

              <div class="field">
                <label>Mot de passe</label>
                <div class="input-wrap">
                  <i class="fa fa-lock"></i>
                  <input [type]="showPass() ? 'text' : 'password'"
                    [(ngModel)]="loginPassword" name="password"
                    placeholder="••••••••" required />
                  <button type="button" class="toggle-pass" (click)="showPass.update(v => !v)">
                    <i [class]="showPass() ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
              </div>

              @if (errorMessage()) {
                <div class="alert alert-error">
                  <i class="fa fa-circle-exclamation"></i> {{ errorMessage() }}
                </div>
              }
              @if (successMessage()) {
                <div class="alert alert-success">
                  <i class="fa fa-circle-check"></i> {{ successMessage() }}
                </div>
              }

              <button type="submit" class="btn-submit" [disabled]="loading()">
                @if (loading()) { <i class="fa fa-spinner fa-spin"></i> }
                @else { <i class="fa fa-right-to-bracket"></i> }
                Se connecter
              </button>

              <div class="divider"><span>comptes de test</span></div>
              <div class="demo-accounts">
                <button type="button" (click)="fillDemo('admin')" class="demo-btn">
                  <i class="fa fa-shield"></i> Admin
                </button>
                <button type="button" (click)="fillDemo('user')" class="demo-btn">
                  <i class="fa fa-user"></i> Utilisateur
                </button>
              </div>
            </form>
          }

          <!-- REGISTER FORM -->
          @if (mode() === 'register') {
            <form class="auth-form" (ngSubmit)="onRegister()">
              <h2>Rejoignez-nous !</h2>
              <p class="subtitle">Créez votre compte gratuit</p>

              <div class="fields-row">
                <div class="field">
                  <label>Prénom</label>
                  <div class="input-wrap">
                    <i class="fa fa-user"></i>
                    <input type="text" [(ngModel)]="regPrenom" name="prenom"
                      placeholder="Prénom" required />
                  </div>
                </div>
                <div class="field">
                  <label>Nom</label>
                  <div class="input-wrap">
                    <i class="fa fa-user"></i>
                    <input type="text" [(ngModel)]="regNom" name="nom"
                      placeholder="Nom" required />
                  </div>
                </div>
              </div>

              <div class="field">
                <label>Email</label>
                <div class="input-wrap">
                  <i class="fa fa-envelope"></i>
                  <input type="email" [(ngModel)]="regEmail" name="email"
                    placeholder="votre@email.com" required />
                </div>
              </div>

              <div class="field">
                <label>Mot de passe</label>
                <div class="input-wrap">
                  <i class="fa fa-lock"></i>
                  <input [type]="showPass() ? 'text' : 'password'"
                    [(ngModel)]="regPassword" name="password"
                    placeholder="Minimum 6 caractères" required minlength="6" />
                  <button type="button" class="toggle-pass" (click)="showPass.update(v => !v)">
                    <i [class]="showPass() ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                </div>
              </div>

              <div class="promo-note">
                <i class="fa fa-gift"></i>
                En vous inscrivant, recevez le code <strong>BIENVENUE10</strong> — 10% de réduction !
              </div>

              @if (errorMessage()) {
                <div class="alert alert-error">
                  <i class="fa fa-circle-exclamation"></i> {{ errorMessage() }}
                </div>
              }

              <button type="submit" class="btn-submit" [disabled]="loading()">
                @if (loading()) { <i class="fa fa-spinner fa-spin"></i> }
                @else { <i class="fa fa-user-plus"></i> }
                Créer mon compte
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0d1b4b 0%, #0d2b6e 50%, #1a47b8 100%);
      padding: 2rem;
    }
    .login-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      max-width: 920px;
      width: 100%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 32px 80px rgba(0,0,0,0.5);
    }
    /* Brand side */
    .login-brand {
      background: linear-gradient(160deg, #1a47b8 0%, #0d2b6e 100%);
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      color: white;
    }
    .brand-logo-big {
      width: 64px; height: 64px;
      background: white;
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }
    .brand-logo-big img { width: 100%; height: 100%; object-fit: cover; }
    .login-brand h1 { font-size: 2rem; font-weight: 800; }
    .login-brand > p { opacity: 1; color: white; line-height: 1.6; font-weight: 500; }
    .brand-features { display: flex; flex-direction: column; gap: 0.75rem; margin: 0.5rem 0; }
    .feature {
      display: flex; align-items: center; gap: 0.75rem;
      font-size: 0.9rem; opacity: 0.9;
    }
    .feature i { color: #f59e0b; width: 18px; text-align: center; }
    .guest-btn {
      display: inline-flex; align-items: center; gap: 0.5rem;
      background: rgba(255,255,255,0.15);
      color: white; padding: 0.75rem 1.5rem;
      border-radius: 10px; font-size: 0.9rem;
      border: 1px solid rgba(255,255,255,0.2);
      transition: all 0.3s;
      text-decoration: none;
      margin-top: auto;
    }
    .guest-btn:hover { background: rgba(255,255,255,0.25); transform: translateY(-2px); }
    /* Form side */
    .login-form-side {
      background: #ffffff;
      padding: 2.5rem;
      display: flex; flex-direction: column; gap: 1.5rem;
    }
    .tabs {
      display: flex; gap: 0;
      background: #f1f5f9;
      border-radius: 12px; padding: 4px;
    }
    .tabs button {
      flex: 1; padding: 0.6rem;
      border-radius: 9px; border: none;
      background: transparent; cursor: pointer;
      font-weight: 500; color: #64748b;
      transition: all 0.3s;
    }
    .tabs button.active {
      background: white;
      color: #1a47b8;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      font-weight: 600;
    }
    .auth-form { display: flex; flex-direction: column; gap: 1.1rem; }
    .auth-form h2 { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
    .subtitle { color: #64748b; margin-top: -0.5rem; font-size: 0.9rem; }
    .fields-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .field { display: flex; flex-direction: column; gap: 0.4rem; }
    label { font-size: 0.85rem; font-weight: 600; color: #374151; }
    .input-wrap {
      position: relative; display: flex; align-items: center;
      border: 1.5px solid #e2e8f0; border-radius: 10px;
      background: #f8fafc; transition: all 0.3s;
    }
    .input-wrap:focus-within {
      border-color: #1a47b8;
      box-shadow: 0 0 0 3px rgba(26,71,184,0.12);
      background: white;
    }
    .input-wrap > i {
      padding: 0 0.75rem; color: #94a3b8; pointer-events: none;
    }
    .input-wrap input {
      flex: 1; border: none; background: transparent;
      padding: 0.7rem 0; font-size: 0.95rem;
      border-radius: 0;
    }
    .toggle-pass {
      background: none; border: none; padding: 0 0.75rem;
      color: #94a3b8; cursor: pointer; transition: color 0.2s;
    }
    .toggle-pass:hover { color: #1a47b8; transform: none; }
    .alert {
      padding: 0.75rem 1rem; border-radius: 10px;
      font-size: 0.88rem; display: flex; align-items: center; gap: 0.5rem;
    }
    .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
    .alert-success { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .btn-submit {
      background: linear-gradient(135deg, #2563eb, #0d2b6e);
      color: white; padding: 0.85rem;
      border-radius: 12px; font-size: 0.95rem; font-weight: 600;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
      transition: all 0.3s; cursor: pointer; border: none;
    }
    .btn-submit:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26,71,184,0.35); }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    .divider {
      display: flex; align-items: center; gap: 1rem;
      color: #94a3b8; font-size: 0.8rem;
    }
    .divider::before, .divider::after {
      content: ''; flex: 1; height: 1px; background: #e2e8f0;
    }
    .demo-accounts { display: flex; gap: 0.75rem; }
    .demo-btn {
      flex: 1; padding: 0.5rem; border-radius: 8px;
      background: #f1f5f9; color: #475569; font-size: 0.85rem;
      border: 1px solid #e2e8f0; cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 0.4rem;
      transition: all 0.2s;
    }
    .demo-btn:hover { background: #e2e8f0; transform: translateY(-1px); }
    .promo-note {
      background: linear-gradient(135deg, #fef3c7, #fef9e7);
      border: 1px solid #f59e0b40;
      padding: 0.75rem 1rem; border-radius: 10px;
      font-size: 0.85rem; color: #92400e;
      display: flex; align-items: center; gap: 0.5rem;
    }
    @media (max-width: 640px) {
      .login-container { grid-template-columns: 1fr; }
      .login-brand { display: none; }
    }
  `]
})
export class LoginComponent {
  mode = signal<'login' | 'register'>('login');
  showPass = signal(false);
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  loginEmail = '';
  loginPassword = '';
  regPrenom = '';
  regNom = '';
  regEmail = '';
  regPassword = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  fillDemo(type: 'admin' | 'user') {
    if (type === 'admin') {
      this.loginEmail = 'admin@shopnow.ma';
      this.loginPassword = 'admin123';
    } else {
      this.loginEmail = 'sana@example.com';
      this.loginPassword = 'user123';
    }
  }

  onLogin() {
    this.errorMessage.set('');
    this.loading.set(true);
    setTimeout(() => {
      const result = this.authService.login(this.loginEmail, this.loginPassword);
      this.loading.set(false);
      if (result.success) {
        this.successMessage.set(result.message);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/produits';
        setTimeout(() => this.router.navigateByUrl(returnUrl), 700);
      } else {
        this.errorMessage.set(result.message);
      }
    }, 600);
  }

  onRegister() {
    this.errorMessage.set('');
    if (this.regPassword.length < 6) {
      this.errorMessage.set('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    this.loading.set(true);
    setTimeout(() => {
      const result = this.authService.register(this.regNom, this.regPrenom, this.regEmail, this.regPassword);
      this.loading.set(false);
      if (result.success) {
        setTimeout(() => this.router.navigate(['/produits']), 700);
      } else {
        this.errorMessage.set(result.message);
      }
    }, 600);
  }
}