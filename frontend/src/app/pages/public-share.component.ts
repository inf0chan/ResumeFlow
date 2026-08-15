import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Doc, Section, Item } from '../core/models';

@Component({
  selector: 'app-public-share',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="shell" style="max-width:640px;padding-top:48px;">
      <div class="preview-card" *ngIf="doc">
        <h1>{{ doc.title }}</h1>
        <ng-container *ngFor="let section of sections">
          <ng-container *ngIf="(section.items || []).length">
            <h2>{{ section.heading }}</h2>
            <ul><li *ngFor="let item of section.items">{{ item.content }}</li></ul>
          </ng-container>
        </ng-container>
      </div>
      <p *ngIf="notFound" style="text-align:center;color:var(--text-dim);">This link is invalid or has been revoked.</p>
    </main>
  `,
})
export class PublicShareComponent implements OnInit {
  doc: Doc | null = null;
  sections: (Section & { items: Item[] })[] = [];
  notFound = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getSharedDocument(slug).subscribe({
      next: res => { this.doc = res.document; this.sections = res.document.sections || []; },
      error: () => (this.notFound = true),
    });
  }
}
