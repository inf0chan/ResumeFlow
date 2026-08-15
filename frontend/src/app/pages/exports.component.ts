import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { Export } from '../core/models';

@Component({
  selector: 'app-exports',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell">
      <section class="page-head">
        <div>
          <h1>Exports</h1>
          <p>Every PDF you've generated from a document, ready to download again.</p>
        </div>
      </section>

      <article class="card share-row" *ngFor="let e of exports">
        <span class="share-icon">⇩</span>
        <div>
          <div class="share-title">{{ e.document?.title }} — {{ e.format | uppercase }}</div>
          <div class="share-date">Exported {{ e.createdAt | date:'medium' }}</div>
        </div>
      </article>

      <div class="card empty-state" *ngIf="!loading && !exports.length">
        <div class="icon">⇩</div>
        <h3 style="margin:0 0 6px;font-weight:600;">Nothing exported yet</h3>
        <p style="margin:0;font-size:13.5px;">Open a document and export it to PDF to see it listed here.</p>
      </div>
    </main>

    <app-footer></app-footer>
  `,
})
export class ExportsComponent implements OnInit {
  exports: Export[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.listExports().subscribe({
      next: res => { this.exports = res.exports; this.loading = false; },
      error: () => (this.loading = false),
    });
  }
}
