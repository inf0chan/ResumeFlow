import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  template: `
    <header class="topnav">
      <a routerLink="/dashboard" class="brand">ResumeFlow</a>
      <nav class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active"><span>▦</span>Dashboard</a>
        <a routerLink="/documents" routerLinkActive="active"><span>▤</span>Documents</a>
        <a routerLink="/templates" routerLinkActive="active"><span>◐</span>Templates</a>
        <a routerLink="/applications" routerLinkActive="active"><span>▣</span>Applications</a>
        <a routerLink="/shares" routerLinkActive="active"><span>⇢</span>Shared links</a>
        <a routerLink="/exports" routerLinkActive="active"><span>⇩</span>Exports</a>
      </nav>
      <div class="avatar-wrap">
        <button class="avatar-trigger" (click)="menuOpen = !menuOpen">
          <span class="avatar-circle">{{ initials() }}</span>
          {{ auth.currentUser()?.name || 'Account' }}
          <span class="chevron">▾</span>
        </button>
        <div class="avatar-menu" [class.open]="menuOpen" (click)="menuOpen = false">
          <a class="menu-item" (click)="openProfile($event)">👤 Profile</a>
          <a class="menu-item" (click)="openPassword($event)">⟳ Change password</a>
          <hr />
          <button class="danger" (click)="signOut()">↪ Sign out</button>
        </div>
      </div>
    </header>

    <!-- ─── Profile modal ────────────────────────────────────────────── -->
    <div class="modal-overlay" *ngIf="showProfile" (click)="showProfile = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h2>Your Profile</h2>
        <p class="sub">View and update your account details.</p>
        <div class="auth-error" *ngIf="profileMsg" [style.borderColor]="profileOk ? 'rgba(52,211,153,0.3)' : ''" [style.background]="profileOk ? 'rgba(52,211,153,0.1)' : ''" [style.color]="profileOk ? 'var(--green)' : ''">{{ profileMsg }}</div>
        <div class="field"><label>Name</label><input type="text" [(ngModel)]="profileName" required /></div>
        <div class="field"><label>Email</label><input type="email" [(ngModel)]="profileEmail" required /></div>
        <div class="modal-actions">
          <button class="btn" (click)="showProfile = false">Cancel</button>
          <button class="btn btn-primary" (click)="saveProfile()">Save</button>
        </div>
      </div>
    </div>

    <!-- ─── Change password modal ─────────────────────────────────────── -->
    <div class="modal-overlay" *ngIf="showPassword" (click)="showPassword = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h2>Change Password</h2>
        <p class="sub">Enter your current and new password.</p>
        <div class="auth-error" *ngIf="pwMsg" [style.borderColor]="pwOk ? 'rgba(52,211,153,0.3)' : ''" [style.background]="pwOk ? 'rgba(52,211,153,0.1)' : ''" [style.color]="pwOk ? 'var(--green)' : ''">{{ pwMsg }}</div>
        <div class="field"><label>Current password</label><input type="password" [(ngModel)]="currentPw" required /></div>
        <div class="field"><label>New password</label><input type="password" [(ngModel)]="newPw" required minlength="6" /></div>
        <div class="field"><label>Confirm new password</label><input type="password" [(ngModel)]="confirmPw" required minlength="6" /></div>
        <div class="modal-actions">
          <button class="btn" (click)="showPassword = false">Cancel</button>
          <button class="btn btn-primary" [disabled]="pwLoading" (click)="submitPassword()">{{ pwLoading ? 'Saving…' : 'Update password' }}</button>
        </div>
      </div>
    </div>
  `,
})
export class NavbarComponent implements OnInit {
  menuOpen = false;

  showProfile = false;
  profileName = '';
  profileEmail = '';
  profileMsg = '';
  profileOk = false;

  showPassword = false;
  currentPw = '';
  newPw = '';
  confirmPw = '';
  pwMsg = '';
  pwOk = false;
  pwLoading = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (!this.auth.currentUser()) {
      this.auth.fetchMe().subscribe();
    }
  }

  initials(): string {
    const name = this.auth.currentUser()?.name;
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length > 1 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0][0].toUpperCase();
  }

  openProfile(e: Event) {
    e.stopPropagation();
    this.menuOpen = false;
    const u = this.auth.currentUser();
    this.profileName = u?.name || '';
    this.profileEmail = u?.email || '';
    this.profileMsg = '';
    this.showProfile = true;
  }

  saveProfile() {
    this.profileMsg = '';
    this.auth.updateProfile({ name: this.profileName, email: this.profileEmail } as any).subscribe({
      next: () => { this.profileMsg = 'Profile updated!'; this.profileOk = true; },
      error: (err) => { this.profileMsg = err.error?.message || 'Update failed'; this.profileOk = false; },
    });
  }

  openPassword(e: Event) {
    e.stopPropagation();
    this.menuOpen = false;
    this.currentPw = '';
    this.newPw = '';
    this.confirmPw = '';
    this.pwMsg = '';
    this.showPassword = true;
  }

  submitPassword() {
    if (this.newPw !== this.confirmPw) {
      this.pwMsg = 'New passwords do not match';
      this.pwOk = false;
      return;
    }
    this.pwLoading = true;
    this.pwMsg = '';
    this.auth.changePassword(this.currentPw, this.newPw).subscribe({
      next: () => { this.pwLoading = false; this.pwMsg = 'Password updated!'; this.pwOk = true; },
      error: (err) => { this.pwLoading = false; this.pwMsg = err.error?.message || 'Update failed'; this.pwOk = false; },
    });
  }

  signOut() {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }
}
