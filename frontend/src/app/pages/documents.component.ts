import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { Doc } from '../core/models';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Documents</h1>
          <p>Every resume, CV and cover letter you are working on.</p>
        </div>
        <div class="head-actions">
          <button class="btn btn-primary" (click)="createDocument()">+ New document</button>
        </div>
      </section>

      <section class="filter-row">
        <input class="search-input" type="text" placeholder="🔍 Search by title" [(ngModel)]="search" (ngModelChange)="onFilterChange()" />
        <select class="select-input" [(ngModel)]="type" (ngModelChange)="load()">
          <option value="all">All types</option>
          <option value="resume">Resume</option>
          <option value="cv">CV</option>
          <option value="cover-letter">Cover letter</option>
        </select>
      </section>

      <section class="grid">
        <article class="card doc-card" *ngFor="let doc of docs" (click)="open(doc)" style="cursor:pointer;">
          <button class="kebab" (click)="menu(doc, $event)">⋮</button>
          <span class="doc-icon-lg">📄</span>
          <h3>{{ doc.title }}</h3>
          <div class="chip-row">
            <span class="chip">{{ doc.type }}</span>
            <span class="chip" *ngIf="doc.template">{{ doc.template.name }}</span>
          </div>
          <div class="meta">Updated {{ doc.updatedAt | date:'medium' }}</div>
        </article>

        <div class="card empty-state" style="grid-column:1/-1;" *ngIf="!loading && !docs.length">
          <div class="icon">📄</div>
          <h3 style="margin:0 0 6px;font-weight:600;">No documents yet</h3>
          <p style="margin:0 0 16px;font-size:13.5px;">Create your first resume, CV, or cover letter.</p>
          <button class="btn btn-primary" (click)="createDocument()">Create your first document</button>
        </div>
      </section>
    </main>

    <app-footer></app-footer>
  `,
})
export class DocumentsComponent implements OnInit {
  docs: Doc[] = [];
  search = '';
  type = 'all';
  loading = true;
  private debounceHandle: any;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.listDocuments(this.search, this.type).subscribe({
      next: res => { this.docs = res.documents; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  onFilterChange() {
    clearTimeout(this.debounceHandle);
    this.debounceHandle = setTimeout(() => this.load(), 300);
  }

  open(doc: Doc) {
    this.router.navigate(['/documents', doc.id]);
  }

  createDocument() {
    const title = prompt('Document title:');
    if (!title) return;
    const type = prompt('Type (resume / cv / cover-letter):', 'resume') || 'resume';
    this.api.createDocument({ title, type }).subscribe({
      next: res => this.router.navigate(['/documents', res.document.id]),
      error: err => alert(err.error?.message || 'Could not create document'),
    });
  }

  menu(doc: Doc, event: Event) {
    event.stopPropagation();
    const choice = prompt(`"${doc.title}"\n\nType: duplicate, rename, or delete`, 'duplicate');
    if (!choice) return;

    if (choice === 'duplicate') {
      this.api.duplicateDocument(doc.id).subscribe(() => this.load());
    } else if (choice === 'rename') {
      const newTitle = prompt('New title:', doc.title);
      if (newTitle) this.api.updateDocument(doc.id, { title: newTitle }).subscribe(() => this.load());
    } else if (choice === 'delete') {
      if (confirm(`Delete "${doc.title}"? This can't be undone.`)) {
        this.api.deleteDocument(doc.id).subscribe(() => this.load());
      }
    }
  }
}
