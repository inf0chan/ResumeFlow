import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar.component';
import { FooterComponent } from '../shared/footer.component';
import { ApiService } from '../core/api.service';
import { AuthService } from '../core/auth.service';
import { Doc, Section, Item, Version, Share, Export } from '../core/models';

type Tab = 'editor' | 'versions' | 'sharing' | 'exports';

@Component({
  selector: 'app-document-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>

    <main class="shell" *ngIf="doc">
      <div class="editor-head">
        <div class="back-title">
          <span class="back-arrow" (click)="back()">←</span>
          <h1>{{ doc.title }}</h1>
        </div>
        <div class="head-actions">
          <button class="btn" (click)="renameDocument()">⚙ Settings</button>
          <button class="btn" (click)="printView()">🖶 Print view</button>
          <button class="btn btn-primary" (click)="exportDocument()">⇩ Export</button>
        </div>
      </div>
      <p class="editor-meta">{{ doc.type }} · {{ doc.template?.name || 'No template' }} · updated {{ doc.updatedAt | date:'medium' }}</p>

      <div class="editor-tabs">
        <button [class.active]="tab === 'editor'" (click)="tab = 'editor'">Editor</button>
        <button [class.active]="tab === 'versions'" (click)="tab = 'versions'; loadVersions()">Versions ({{ versions.length }})</button>
        <button [class.active]="tab === 'sharing'" (click)="tab = 'sharing'; loadShares()">Sharing ({{ shares.length }})</button>
        <button [class.active]="tab === 'exports'" (click)="tab = 'exports'; loadExports()">Exports ({{ exports.length }})</button>
      </div>

      <!-- ─── Editor tab ─────────────────────────────────────────────────── -->
      <div class="editor-layout" *ngIf="tab === 'editor'">
        <div>
          <div class="add-section-input">
            <input type="text" placeholder="Add a section" [(ngModel)]="newSectionHeading" (keyup.enter)="addSection()" />
            <button (click)="addSection()">⊕</button>
          </div>

          <div class="section-block" *ngFor="let section of sections">
            <div class="sb-head">
              <span class="grip">⠿</span>
              <span class="sb-title">{{ section.heading || 'Untitled section' }}</span>
              <span class="sb-count">{{ (section.items || []).length }} item(s)</span>
              <button class="collapse-btn" (click)="section['collapsed'] = !section['collapsed']">{{ section['collapsed'] ? '▾' : '▴' }}</button>
            </div>

            <ng-container *ngIf="!section['collapsed']">
              <div class="heading-label">Heading</div>
              <input class="heading-input" type="text" [(ngModel)]="section.heading" (blur)="saveSectionHeading(section)" />

              <div class="item-row" *ngFor="let item of section.items">
                <span class="grip">⠿</span>
                <textarea [(ngModel)]="item.content" (blur)="saveItem(item)"></textarea>
                <button class="del-item" (click)="deleteItem(section, item)">🗑</button>
              </div>

              <div class="sb-footer">
                <button class="add-bullet-btn" (click)="addItem(section)">+ Add bullet</button>
                <button class="del-section-btn" (click)="deleteSection(section)">🗑 Delete section</button>
              </div>
            </ng-container>
          </div>

          <p class="empty-editor" *ngIf="!sections.length">No sections yet — add one above to start building this document.</p>
        </div>

        <!-- ─── Live preview ─────────────────────────────────────────────── -->
        <div class="preview-card">
          <h1>{{ firstName() }} <span class="accent">{{ lastName() }}</span></h1>
          <div class="role">{{ doc.title | uppercase }}</div>
          <div class="contact-line">{{ auth.currentUser()?.email }}</div>

          <ng-container *ngFor="let section of sections">
            <ng-container *ngIf="(section.items || []).length">
              <h2>{{ section.heading }}</h2>
              <ul>
                <li *ngFor="let item of section.items">{{ item.content }}</li>
              </ul>
            </ng-container>
          </ng-container>
        </div>
      </div>

      <!-- ─── Versions tab ───────────────────────────────────────────────── -->
      <div *ngIf="tab === 'versions'">
        <div class="head-actions" style="margin-bottom:16px;">
          <button class="btn btn-primary" (click)="saveVersion()">+ Save current version</button>
        </div>
        <article class="card share-row" *ngFor="let v of versions">
          <span class="share-icon">⏱</span>
          <div>
            <div class="share-title">{{ v.label }}</div>
            <div class="share-date">Saved {{ v.createdAt | date:'medium' }}</div>
          </div>
          <div class="share-actions">
            <button class="icon-btn danger" (click)="removeVersion(v)" title="Delete">⊘</button>
          </div>
        </article>
        <p class="empty-editor" *ngIf="!versions.length">No saved versions yet.</p>
      </div>

      <!-- ─── Sharing tab ────────────────────────────────────────────────── -->
      <div *ngIf="tab === 'sharing'">
        <div class="head-actions" style="margin-bottom:16px;">
          <button class="btn btn-primary" (click)="createShareLink()">+ Create share link</button>
        </div>
        <article class="card share-row" *ngFor="let s of shares">
          <span class="share-icon">🔗</span>
          <div>
            <div class="share-title">{{ doc.title }}</div>
            <div class="share-url">{{ shareUrl(s) }}</div>
            <div class="share-date">Created {{ s.createdAt | date:'medium' }}</div>
          </div>
          <div class="share-actions">
            <button class="icon-btn" (click)="copyLink(s)" title="Copy link">⧉</button>
            <button class="icon-btn danger" (click)="removeShare(s)" title="Revoke">⊘</button>
          </div>
        </article>
        <p class="empty-editor" *ngIf="!shares.length">No public links for this document yet.</p>
      </div>

      <!-- ─── Exports tab ────────────────────────────────────────────────── -->
      <div *ngIf="tab === 'exports'">
        <article class="card share-row" *ngFor="let e of exports">
          <span class="share-icon">⇩</span>
          <div>
            <div class="share-title">{{ e.format | uppercase }} export</div>
            <div class="share-date">Exported {{ e.createdAt | date:'medium' }}</div>
          </div>
        </article>
        <p class="empty-editor" *ngIf="!exports.length">Nothing exported yet — use the Export button above.</p>
      </div>
    </main>

    <app-footer></app-footer>
  `,
})
export class DocumentEditorComponent implements OnInit {
  doc: Doc | null = null;
  sections: Section[] = [];
  versions: Version[] = [];
  shares: Share[] = [];
  exports: Export[] = [];
  tab: Tab = 'editor';
  newSectionHeading = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    if (!this.auth.currentUser()) this.auth.fetchMe().subscribe();

    const id = this.route.snapshot.paramMap.get('id')!;
    this.api.getDocument(id).subscribe(res => (this.doc = res.document));
    this.loadSections(id);
  }

  private loadSections(documentId: string) {
    this.api.listSections(documentId).subscribe(res => {
      this.sections = res.sections;
      this.sections.forEach(s => this.api.listItems(s.id).subscribe(itemsRes => (s.items = itemsRes.items)));
    });
  }

  back() { this.router.navigate(['/documents']); }

  firstName(): string { return this.auth.currentUser()?.name?.split(' ')[0] || ''; }
  lastName(): string { const parts = this.auth.currentUser()?.name?.split(' ') || []; return parts.slice(1).join(' '); }

  renameDocument() {
    if (!this.doc) return;
    const title = prompt('Document title:', this.doc.title);
    if (!title) return;
    this.api.updateDocument(this.doc.id, { title }).subscribe(res => (this.doc = res.document));
  }

  printView() { window.print(); }

  exportDocument() {
    if (!this.doc) return;
    const fileUrl = `/exports/${this.doc.id}-${Date.now()}.pdf`;
    this.api.createExport({ format: 'pdf', fileUrl, documentId: this.doc.id }).subscribe(() => {
      alert("Export recorded. (Actual PDF rendering isn't wired up yet — this logs the export event only.)");
      if (this.tab === 'exports') this.loadExports();
    });
  }

  addSection() {
    if (!this.doc || !this.newSectionHeading.trim()) return;
    this.api.createSection({ heading: this.newSectionHeading.trim(), position: this.sections.length, documentId: this.doc.id })
      .subscribe(res => {
        this.sections.push({ ...res.section, items: [] });
        this.newSectionHeading = '';
      });
  }

  saveSectionHeading(section: Section) {
    this.api.updateSection(section.id, { heading: section.heading }).subscribe();
  }

  deleteSection(section: Section) {
    if (!confirm(`Delete section "${section.heading}"?`)) return;
    this.api.deleteSection(section.id).subscribe(() => {
      this.sections = this.sections.filter(s => s.id !== section.id);
    });
  }

  addItem(section: Section) {
    this.api.createItem({ content: '', position: (section.items || []).length, sectionId: section.id })
      .subscribe(res => { section.items = [...(section.items || []), res.item]; });
  }

  saveItem(item: Item) {
    this.api.updateItem(item.id, { content: item.content }).subscribe();
  }

  deleteItem(section: Section, item: Item) {
    this.api.deleteItem(item.id).subscribe(() => {
      section.items = (section.items || []).filter(i => i.id !== item.id);
    });
  }

  // ─── Versions ────────────────────────────────────────────────────────────
  loadVersions() {
    if (!this.doc) return;
    this.api.listVersions(this.doc.id).subscribe(res => (this.versions = res.versions));
  }
  saveVersion() {
    if (!this.doc) return;
    const label = prompt('Version label:', new Date().toLocaleString()) || undefined;
    this.api.createVersion({ label, snapshot: this.sections, documentId: this.doc.id }).subscribe(() => this.loadVersions());
  }
  removeVersion(v: Version) {
    if (!confirm('Delete this saved version?')) return;
    this.api.deleteVersion(v.id).subscribe(() => this.loadVersions());
  }

  // ─── Sharing ─────────────────────────────────────────────────────────────
  loadShares() {
    if (!this.doc) return;
    this.api.listShares().subscribe(res => {
      this.shares = res.shares.filter(s => s.document?.id === this.doc!.id);
    });
  }
  createShareLink() {
    if (!this.doc) return;
    this.api.createShare(this.doc.id).subscribe(() => this.loadShares());
  }
  removeShare(s: Share) {
    if (!confirm('Revoke this share link?')) return;
    this.api.revokeShare(s.id).subscribe(() => this.loadShares());
  }
  shareUrl(s: Share): string { return `${location.origin}/r/${s.slug}`; }
  copyLink(s: Share) { navigator.clipboard?.writeText(this.shareUrl(s)); }

  // ─── Exports ─────────────────────────────────────────────────────────────
  loadExports() {
    if (!this.doc) return;
    this.api.listExports().subscribe(res => {
      this.exports = res.exports.filter(e => e.document?.id === this.doc!.id);
    });
  }
}
