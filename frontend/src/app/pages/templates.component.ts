import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { Template } from '../core/models';

const ACCENTS = ['#7c8cff', '#2ee6a8', '#f2545b', '#f2a93b', '#34d399', '#4c8dff'];

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Templates</h1>
          <p>Pick a look, then build a document on top of it.</p>
        </div>
        <div class="head-actions">
          <button class="btn btn-primary" (click)="createTemplate()">+ New template</button>
        </div>
      </section>

      <section class="grid">
        <article class="card tpl-card" *ngFor="let tpl of templates; let i = index">
          <div class="tpl-strip" [style.background]="accent(i)"></div>
          <h3>{{ tpl.name }}</h3>
          <div class="chip-row"><span class="chip">{{ layoutOf(tpl) }}</span></div>
          <div class="tpl-preview">
            <span class="avatar-dot" *ngIf="layoutOf(tpl) === 'sidebar'" [style.background]="accent(i)"></span>
            <div class="lines">
              <span class="name" [style.background]="accent(i)"></span>
              <span></span><span></span><span style="width:70%"></span>
            </div>
          </div>
          <button class="btn btn-primary tpl-full-btn" (click)="useTemplate(tpl)">Use this template</button>
        </article>

        <p style="color:var(--text-faint);font-size:13px;" *ngIf="!loading && !templates.length">No templates yet — create one to get started.</p>
      </section>
    </main>

    <app-footer></app-footer>
  `,
})
export class TemplatesComponent implements OnInit {
  templates: Template[] = [];
  loading = true;

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit() {
    this.api.listTemplates().subscribe({
      next: res => { this.templates = res.templates; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  accent(i: number): string { return ACCENTS[i % ACCENTS.length]; }

  layoutOf(tpl: Template): string {
    try { return JSON.parse(tpl.config || '{}').layout || 'simple'; } catch { return 'simple'; }
  }

  useTemplate(tpl: Template) {
    const title = prompt('Name this document:', `${tpl.name} resume`);
    if (!title) return;
    this.api.createDocument({ title, type: 'resume', templateId: tpl.id }).subscribe({
      next: res => this.router.navigate(['/documents', res.document.id]),
      error: err => alert(err.error?.message || 'Could not create document'),
    });
  }

  createTemplate() {
    const name = prompt('Template name:');
    if (!name) return;
    const accent = prompt('Accent color (hex):', '#2ee6a8') || '#2ee6a8';
    const layout = prompt('Layout (simple / sidebar):', 'simple') || 'simple';
    this.api.createTemplate({ name, config: { accent, layout } }).subscribe(res => {
      this.templates = [...this.templates, res.template];
    });
  }
}
