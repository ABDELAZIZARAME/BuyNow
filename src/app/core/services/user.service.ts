import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/index';
import { USERS } from './mock-data';

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [...USERS];
  private usersSubject = new BehaviorSubject<User[]>(this.users);

  users$ = this.usersSubject.asObservable();

  getAll(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  // ✅ NOUVEAU — appelé par auth.service lors du register()
  ajouter(user: User): void {
    const existe = this.users.find(u => u.email === user.email);
    if (!existe) {
      this.users = [...this.users, user];
      this.usersSubject.next([...this.users]);
    }
  }

  toggleActif(id: number): void {
    this.users = this.users.map(u =>
      u.id === id ? { ...u, actif: !u.actif } : u
    );
    this.usersSubject.next([...this.users]);
  }

  supprimer(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.usersSubject.next([...this.users]);
  }

  isAdmin(email: string, password: string): boolean {
    return email === 'admin@shopnow.ma' && password === 'admin123';
  }
}