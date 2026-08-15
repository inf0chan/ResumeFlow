import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="topnav">
      <a routerLink="/dashboard" class="brand">Resume Loop</a>
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
          <a class="menu-item" href="#">👤 Profile</a>
          <a class="menu-item" href="#">⟳ Change password</a>
          <hr />
          <button class="danger" (click)="signOut()">↪ Sign out</button>
        </div>
      </div>
    </header>
  `,
})
export class NavbarComponent implements OnInit {
  menuOpen = false;

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

  signOut() {
    this.auth.clearToken();
    this.router.navigate(['/login']);
  }
}
