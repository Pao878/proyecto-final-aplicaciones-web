// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { email, password };
    return this.http.post<LoginResponse>(this.apiUrl, loginData);
  }

  saveUser(usuario: User): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getCurrentUser(): User | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('usuario');
  }

  isAdmin(): boolean {
    const usuario = this.getCurrentUser();
    return usuario?.rol === 'administrador';
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }
}
