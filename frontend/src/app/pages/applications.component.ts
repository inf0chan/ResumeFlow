import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { AppStatus, JobApplication } from '../core/models';

const COLUMNS: { status: AppStatus; label: string; color: string }[] = [
  { status: 'saved', label: 'Saved', color: 'var(--gray)' },
  { status: 'applied', label: 'Applied', color: 'var(--blue)' },
  { status: 'interview', label: 'Interview', color: 'var(--orange)' },
  { status: 'offer', label: 'Offer', color: 'var(--green)' },
  { status: 'rejected', label: 'Rejected', color: 'var(--red)' },
];

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Applications</h1>
          <p>Drag a card between columns to move it along your pipeline.</p>
        </div>
        <div class="head-actions">
          <div class="view-toggle">
            <button [class.active]="view === 'board'" (click)="view = 'board'">▦ Board</button>
            <button [class.active]="view === 'table'" (click)="view = 'table'">☰ Table</button>
          </div>
          <button class="btn btn-primary" (click)="trackApplication()">+ Track application</button>
        </div>
      </section>

      <section class="board" *ngIf="view === 'board'">
        <div class="column" *ngFor="let col of columns"
             (dragover)="$event.preventDefault()"
             (drop)="onDrop($event, col.status)">
          <div class="col-head">
            <span class="status-dot" [style.background]="col.color"></span>{{ col.label }}
            <span class="count">{{ byStatus(col.status).length }}</span>
          </div>
          <div class="app-card" *ngFor="let app of byStatus(col.status)" draggable="true" (dragstart)="onDragStart($event, app)">
            <div class="company">{{ app.company }}</div>
            <div class="role">{{ app.role }}</div>
            <div class="doc-link" *ngIf="app.document">📄 {{ app.document.title }}</div>
            <div class="date">{{ app.updatedAt | date:'MMM d, y' }}</div>
          </div>
        </div>
      </section>

      <section class="card" style="padding:0;overflow:hidden;" *ngIf="view === 'table'">
        <table style="width:100%;border-collapse:collapse;font-size:13.5px;">
          <thead>
            <tr style="text-align:left;color:var(--text-dim);border-bottom:1px solid var(--border);">
              <th style="padding:12px 16px;">Company</th>
              <th style="padding:12px 16px;">Role</th>
              <th style="padding:12px 16px;">Status</th>
              <th style="padding:12px 16px;">Document</th>
              <th style="padding:12px 16px;">Updated</th>
              <th style="padding:12px 16px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let app of applications" style="border-bottom:1px solid var(--border-soft);">
              <td style="padding:12px 16px;">{{ app.company }}</td>
              <td style="padding:12px 16px;color:var(--text-dim);">{{ app.role }}</td>
              <td style="padding:12px 16px;text-transform:capitalize;">{{ app.status }}</td>
              <td style="padding:12px 16px;color:var(--blue);">{{ app.document?.title || '—' }}</td>
              <td style="padding:12px 16px;color:var(--text-faint);">{{ app.updatedAt | date:'MMM d, y' }}</td>
              <td style="padding:12px 16px;"><button class="icon-btn danger" (click)="deleteApplication(app)" title="Delete">⊘</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>

    <app-footer></app-footer>
  `,
})
export class ApplicationsComponent implements OnInit {
  columns = COLUMNS;
  applications: JobApplication[] = [];
  view: 'board' | 'table' = 'board';
  private dragged: JobApplication | null = null;

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.listApplications().subscribe(res => (this.applications = res.applications));
  }

  byStatus(status: AppStatus): JobApplication[] {
    return this.applications.filter(a => a.status === status);
  }

  onDragStart(event: DragEvent, app: JobApplication) {
    this.dragged = app;
    event.dataTransfer?.setData('text/plain', String(app.id));
  }

  onDrop(event: DragEvent, status: AppStatus) {
    event.preventDefault();
    if (!this.dragged || this.dragged.status === status) return;
    const app = this.dragged;
    this.api.updateApplication(app.id, { status }).subscribe(() => {
      app.status = status;
      this.dragged = null;
    });
  }

  trackApplication() {
    const company = prompt('Company:');
    if (!company) return;
    const role = prompt('Role:');
    if (!role) return;
    this.api.createApplication({ company, role, status: 'saved' }).subscribe(() => this.load());
  }

  deleteApplication(app: JobApplication) {
    if (!confirm('Delete this application?')) return;
    this.api.deleteApplication(app.id).subscribe(() => this.load());
  }
}
