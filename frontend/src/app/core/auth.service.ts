import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './models';

const TOKEN_KEY = 'rf_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  register(name: string, email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/auth/register`, { name, email, password })
      .pipe(tap(res => { this.setToken(res.token); this.currentUser.set(res.user); }));
  }

  login(email: string, password: string): Observable<{ token: string; user: User }> {
    return this.http.post<{ token: string; user: User }>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => { this.setToken(res.token); this.currentUser.set(res.user); }));
  }

  fetchMe(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${environment.apiUrl}/users/me`)
      .pipe(tap(res => this.currentUser.set(res.user)));
  }

  updateProfile(payload: Partial<User>) {
    return this.http.patch<{ user: User }>(`${environment.apiUrl}/users/me`, payload)
      .pipe(tap(res => this.currentUser.set(res.user)));
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.patch(`${environment.apiUrl}/users/me/password`, { currentPassword, newPassword });
  }
}
