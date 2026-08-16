import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="auth-shell">
      <article class="card auth-card">
        <span class="brand" style="text-align:center;">ResumeFlow</span>

        <ng-container *ngIf="mode === 'login'">
          <h2>Welcome back</h2>
          <p class="sub">Sign in to keep building your resumes.</p>
          <div class="auth-error" *ngIf="error">{{ error }}</div>
          <form (ngSubmit)="submitLogin()">
            <div class="field"><label>Email</label><input type="email" [(ngModel)]="loginEmail" name="loginEmail" required /></div>
            <div class="field"><label>Password</label><input type="password" [(ngModel)]="loginPassword" name="loginPassword" required /></div>
            <button type="submit" class="btn btn-primary auth-submit" [disabled]="loading">{{ loading ? 'Signing in…' : 'Login' }}</button>
          </form>
          <p class="auth-switch">Don't have an account? <a (click)="switchTo('signup')">Sign up</a></p>
        </ng-container>

        <ng-container *ngIf="mode === 'signup'">
          <h2>Create your account</h2>
          <p class="sub">Free forever for building and tracking resumes.</p>
          <div class="auth-error" *ngIf="error">{{ error }}</div>
          <form (ngSubmit)="submitSignup()">
            <div class="field"><label>Full name</label><input type="text" [(ngModel)]="signupName" name="signupName" required /></div>
            <div class="field"><label>Email</label><input type="email" [(ngModel)]="signupEmail" name="signupEmail" required /></div>
            <div class="field"><label>Password</label><input type="password" [(ngModel)]="signupPassword" name="signupPassword" required minlength="6" /></div>
            <button type="submit" class="btn btn-primary auth-submit" [disabled]="loading">{{ loading ? 'Creating account…' : 'Create account' }}</button>
          </form>
          <p class="auth-switch">Already have an account? <a (click)="switchTo('login')">Login</a></p>
        </ng-container>
      </article>
    </main>
  `,
})
export class LoginComponent {
  mode: 'login' | 'signup' = 'login';
  loading = false;
  error = '';

  loginEmail = '';
  loginPassword = '';
  signupName = '';
  signupEmail = '';
  signupPassword = '';

  constructor(private auth: AuthService, private router: Router) {
    if (this.auth.token) this.router.navigate(['/dashboard']);
  }

  switchTo(mode: 'login' | 'signup') {
    this.mode = mode;
    this.error = '';
  }

  submitLogin() {
    this.loading = true;
    this.error = '';
    this.auth.login(this.loginEmail, this.loginPassword).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Login failed'; },
    });
  }

  submitSignup() {
    this.loading = true;
    this.error = '';
    this.auth.register(this.signupName, this.signupEmail, this.signupPassword).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/dashboard']); },
      error: (err) => { this.loading = false; this.error = err.error?.message || 'Registration failed'; },
    });
  }
}
