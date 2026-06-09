import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/index';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-users">
      <div class="page-header">
        <h2><i class="fa fa-users"></i> Gestion Utilisateurs</h2>
        <span class="total">{{ users.length }} utilisateurs</span>
      </div>

      <div class="search-bar">
        <i class="fa fa-search"></i>
        <input type="text" placeholder="Rechercher..." [(ngModel)]="search" (input)="filtrer()"/>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Inscription</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of usersFiltres">
            <td>
              <div class="user-info">
                <div class="avatar" [class]="user.role">
                  {{ user.prenom[0] }}{{ user.nom[0] }}
                </div>
                <span>{{ user.prenom }} {{ user.nom }}</span>
              </div>
            </td>
            <td>{{ user.email }}</td>
            <td>
              <span class="badge" [class]="'badge-' + user.role">
                {{ user.role }}
              </span>
            </td>
            <td>{{ user.dateInscription | date:'dd/MM/yyyy' }}</td>
            <td>
              <span class="badge" [class]="user.actif ? 'badge-actif' : 'badge-inactif'">
                {{ user.actif ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <div class="actions">
                <button class="btn-toggle" (click)="toggleActif(user.id)"
                  [title]="user.actif ? 'Désactiver' : 'Activer'">
                  <i class="fa" [class]="user.actif ? 'fa-ban' : 'fa-check'"></i>
                </button>
                <button class="btn-delete" (click)="supprimer(user.id)"
                  [disabled]="user.role === 'admin'">
                  <i class="fa fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    h2 { color: #1a2535; }
    .total { color: #888; font-size: 0.9rem; }
    .search-bar { display: flex; align-items: center; gap: 0.75rem; background: white; padding: 0.75rem 1rem; border-radius: 10px; margin-bottom: 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .search-bar input { border: none; outline: none; flex: 1; }
    .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .admin-table th { padding: 1rem; border-bottom: 2px solid #eee; text-align: left; color: #888; font-size: 0.85rem; }
    .admin-table td { padding: 1rem; border-bottom: 1px solid #eee; font-size: 0.9rem; }
    .user-info { display: flex; align-items: center; gap: 0.75rem; }
    .avatar { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: white; }
    .avatar.admin { background: #f59e0b; }
    .avatar.client { background: #1a6b4a; }
    .badge { padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.8rem; font-weight: 500; }
    .badge-admin { background: #fef9c3; color: #854d0e; }
    .badge-client { background: #dbeafe; color: #1e40af; }
    .badge-actif { background: #dcfce7; color: #166534; }
    .badge-inactif { background: #fee2e2; color: #991b1b; }
    .actions { display: flex; gap: 0.5rem; }
    .btn-toggle { background: #dbeafe; color: #1e40af; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
    .btn-delete { background: #fee2e2; color: #991b1b; border: none; padding: 0.4rem 0.75rem; border-radius: 6px; cursor: pointer; }
    .btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }
  `]
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  usersFiltres: User[] = [];
  search = '';

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getAll().subscribe(u => {
      this.users = u;
      this.usersFiltres = u;
    });
  }

  filtrer() {
    this.usersFiltres = this.users.filter(u =>
      `${u.nom} ${u.prenom} ${u.email}`.toLowerCase().includes(this.search.toLowerCase())
    );
  }

  toggleActif(id: number) { this.userService.toggleActif(id); }
  supprimer(id: number) {
    if (confirm('Supprimer cet utilisateur ?')) this.userService.supprimer(id);
  }
}
