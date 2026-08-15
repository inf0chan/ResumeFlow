import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { Share } from '../core/models';

@Component({
  selector: 'app-shares',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Shared links</h1>
          <p>Every public link you have handed out, in one place.</p>
        </div>
        <div class="head-actions">
          <a routerLink="/documents" class="btn">📄 Go to documents</a>
        </div>
      </section>

      <article class="card share-row" *ngFor="let s of shares">
        <span class="share-icon">🔗</span>
        <div>
          <div class="share-title">{{ s.document?.title }}</div>
          <div class="share-url">{{ shareUrl(s) }}</div>
          <div class="share-date">Created {{ s.createdAt | date:'medium' }}</div>
        </div>
        <div class="share-actions">
          <button class="icon-btn" (click)="copyLink(s)" title="Copy link">⧉</button>
          <a class="icon-btn" [href]="shareUrl(s)" target="_blank" title="Open shared view">↗</a>
          <button class="icon-btn" (click)="print()" title="Print view">🖶</button>
          <button class="icon-btn danger" (click)="revoke(s)" title="Revoke">⊘</button>
        </div>
      </article>

      <div class="card empty-state" *ngIf="!loading && !shares.length">
        <div class="icon">🔗</div>
        <h3 style="margin:0 0 6px;font-weight:600;">Nothing shared yet</h3>
        <p style="margin:0;font-size:13.5px;">Open a document and create a public link to share it with a recruiter.</p>
      </div>
    </main>

    <app-footer></app-footer>
  `,
})
export class SharesComponent implements OnInit {
  shares: Share[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.listShares().subscribe({
      next: res => { this.shares = res.shares; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  shareUrl(s: Share): string { return `${location.origin}/r/${s.slug}`; }
  copyLink(s: Share) { navigator.clipboard?.writeText(this.shareUrl(s)); }
  print() { window.print(); }

  revoke(s: Share) {
    if (!confirm('Revoke this share link?')) return;
    this.api.revokeShare(s.id).subscribe(() => {
      this.shares = this.shares.filter(x => x.id !== s.id);
    });
  }
}
