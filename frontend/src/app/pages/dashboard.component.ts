import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Doc, AppStatus } from '../core/models';

const STATUS_ORDER: AppStatus[] = ['saved', 'applied', 'interview', 'offer', 'rejected'];
const STATUS_COLOR: Record<AppStatus, string> = {
  saved: 'var(--gray)', applied: 'var(--blue)', interview: 'var(--orange)',
  offer: 'var(--green)', rejected: 'var(--red)',
};
const STATUS_LABEL: Record<AppStatus, string> = {
  saved: 'Saved', applied: 'Applied', interview: 'Interview', offer: 'Offer', rejected: 'Rejected',
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Hi {{ firstName() }} 👋</h1>
          <p>Here is where everything stands today.</p>
        </div>
        <div class="head-actions">
          <a routerLink="/applications" class="btn">📄 Track an application</a>
          <a routerLink="/templates" class="btn btn-primary">+ New resume</a>
        </div>
      </section>

      <section class="counters">
        <article class="card counter">
          <span class="counter-icon docs">📄</span>
          <div><div class="counter-num">{{ docCount }}</div><div class="counter-label">Documents</div></div>
        </article>
        <article class="card counter">
          <span class="counter-icon apps">💼</span>
          <div><div class="counter-num">{{ appTotal }}</div><div class="counter-label">Applications</div></div>
        </article>
        <article class="card counter">
          <span class="counter-icon versions">⏱</span>
          <div><div class="counter-num">{{ versionCount }}</div><div class="counter-label">Saved versions</div></div>
        </article>
        <article class="card counter">
          <span class="counter-icon exports">⇩</span>
          <div><div class="counter-num">{{ exportCount }}</div><div class="counter-label">Exports</div></div>
        </article>
      </section>

      <section class="dash-row">
        <article class="card panel">
          <div class="panel-head">
            <h2>Recent documents</h2>
            <a routerLink="/documents">View all ›</a>
          </div>

          <ng-container *ngIf="recentDocs.length; else noDocs">
            <a class="doc-row" *ngFor="let doc of recentDocs" [routerLink]="['/documents', doc.id]" style="text-decoration:none;color:inherit;">
              <span class="doc-icon">📄</span>
              <div>
                <div class="doc-title">{{ doc.title }}</div>
                <div class="doc-meta">{{ doc.template?.name || doc.type }} · updated {{ doc.updatedAt | date:'MMM d, y' }}</div>
              </div>
              <span class="chev">›</span>
            </a>
          </ng-container>
          <ng-template #noDocs>
            <p style="color:var(--text-faint);font-size:13px;">No documents yet — <a routerLink="/templates" style="color:var(--accent);">create your first one</a>.</p>
          </ng-template>
        </article>

        <article class="card panel">
          <div class="panel-head">
            <h2>Application pipeline</h2>
            <a routerLink="/applications">Manage ›</a>
          </div>
          <div class="pipe-row" *ngFor="let status of statusOrder">
            <span class="pipe-dot" [style.background]="statusColor[status]"></span>
            <span class="pipe-label">{{ statusLabel[status] }}</span>
            <div class="pipe-bar"><div class="pipe-fill" [style.width.%]="pct(status)" [style.background]="statusColor[status]"></div></div>
            <span class="pipe-count">{{ pipeline[status] || 0 }}</span>
          </div>
        </article>
      </section>
    </main>

    <app-footer></app-footer>
  `,
})
export class DashboardComponent implements OnInit {
  statusOrder = STATUS_ORDER;
  statusColor = STATUS_COLOR;
  statusLabel = STATUS_LABEL;

  recentDocs: Doc[] = [];
  docCount = 0;
  appTotal = 0;
  versionCount = 0;
  exportCount = 0;
  pipeline: Partial<Record<AppStatus, number>> = {};

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    if (!this.auth.currentUser()) this.auth.fetchMe().subscribe();

    this.api.recentDocuments(4).subscribe(res => {
      this.recentDocs = res.documents;
      this.docCount = res.documents.length;
    });
    this.api.pipeline().subscribe(res => {
      this.pipeline = res.pipeline;
      this.appTotal = res.total;
    });
    this.api.versionsCount().subscribe(res => this.versionCount = res.count);
    this.api.exportsCount().subscribe(res => this.exportCount = res.count);
  }

  firstName(): string {
    return this.auth.currentUser()?.name?.split(' ')[0] || 'there';
  }

  pct(status: AppStatus): number {
    if (!this.appTotal) return 0;
    return Math.round(((this.pipeline[status] || 0) / this.appTotal) * 100);
  }
}
