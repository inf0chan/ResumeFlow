import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Doc, Template, Section, Item, Version, JobApplication, Share, Export, AppStatus } from './models';

const base = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ─── Documents ───────────────────────────────────────────────────────────
  recentDocuments(limit = 4) {
    return this.http.get<{ documents: Doc[] }>(`${base}/documents/recent`, { params: { limit } });
  }
  listDocuments(search = '', type = '') {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (type && type !== 'all') params = params.set('type', type);
    return this.http.get<{ documents: Doc[] }>(`${base}/documents`, { params });
  }
  getDocument(id: number | string) {
    return this.http.get<{ document: Doc }>(`${base}/documents/${id}`);
  }
  createDocument(payload: { title: string; type?: string; templateId?: number | string | null }) {
    return this.http.post<{ document: Doc }>(`${base}/documents`, payload);
  }
  updateDocument(id: number | string, payload: Partial<Doc>) {
    return this.http.patch<{ document: Doc }>(`${base}/documents/${id}`, payload);
  }
  duplicateDocument(id: number | string) {
    return this.http.post<{ document: Doc }>(`${base}/documents/${id}/duplicate`, {});
  }
  deleteDocument(id: number | string) {
    return this.http.delete(`${base}/documents/${id}`);
  }

  // ─── Templates ───────────────────────────────────────────────────────────
  listTemplates() {
    return this.http.get<{ templates: Template[] }>(`${base}/templates`);
  }
  createTemplate(payload: { name: string; config?: any }) {
    return this.http.post<{ template: Template }>(`${base}/templates`, payload);
  }

  // ─── Sections / Items (document editor) ────────────────────────────────
  listSections(documentId: number | string) {
    return this.http.get<{ sections: Section[] }>(`${base}/sections/document/${documentId}`);
  }
  createSection(payload: { heading: string; position?: number; documentId: number | string }) {
    return this.http.post<{ section: Section }>(`${base}/sections`, payload);
  }
  updateSection(id: number | string, payload: Partial<Section>) {
    return this.http.patch<{ section: Section }>(`${base}/sections/${id}`, payload);
  }
  deleteSection(id: number | string) {
    return this.http.delete(`${base}/sections/${id}`);
  }

  listItems(sectionId: number | string) {
    return this.http.get<{ items: Item[] }>(`${base}/items/section/${sectionId}`);
  }
  createItem(payload: { content: string; position?: number; sectionId: number | string }) {
    return this.http.post<{ item: Item }>(`${base}/items`, payload);
  }
  updateItem(id: number | string, payload: Partial<Item>) {
    return this.http.patch<{ item: Item }>(`${base}/items/${id}`, payload);
  }
  deleteItem(id: number | string) {
    return this.http.delete(`${base}/items/${id}`);
  }

  // ─── Versions ────────────────────────────────────────────────────────────
  listVersions(documentId: number | string) {
    return this.http.get<{ versions: Version[] }>(`${base}/versions/document/${documentId}`);
  }
  versionsCount() {
    return this.http.get<{ count: number }>(`${base}/versions/count`);
  }
  createVersion(payload: { label?: string; snapshot?: any; documentId: number | string }) {
    return this.http.post<{ version: Version }>(`${base}/versions`, payload);
  }
  deleteVersion(id: number | string) {
    return this.http.delete(`${base}/versions/${id}`);
  }

  // ─── Applications ────────────────────────────────────────────────────────
  listApplications() {
    return this.http.get<{ applications: JobApplication[] }>(`${base}/applications`);
  }
  pipeline() {
    return this.http.get<{ pipeline: Record<AppStatus, number>; total: number }>(`${base}/applications/pipeline`);
  }
  createApplication(payload: { company: string; role: string; status?: AppStatus; documentId?: number | string | null }) {
    return this.http.post<{ application: JobApplication }>(`${base}/applications`, payload);
  }
  updateApplication(id: number | string, payload: Partial<JobApplication>) {
    return this.http.patch<{ application: JobApplication }>(`${base}/applications/${id}`, payload);
  }
  deleteApplication(id: number | string) {
    return this.http.delete(`${base}/applications/${id}`);
  }

  // ─── Shares ──────────────────────────────────────────────────────────────
  listShares() {
    return this.http.get<{ shares: Share[] }>(`${base}/shares`);
  }
  createShare(documentId: number | string) {
    return this.http.post<{ share: Share }>(`${base}/shares`, { documentId });
  }
  revokeShare(id: number | string) {
    return this.http.delete(`${base}/shares/${id}`);
  }

  // ─── Exports ─────────────────────────────────────────────────────────────
  listExports() {
    return this.http.get<{ exports: Export[] }>(`${base}/exports`);
  }
  exportsCount() {
    return this.http.get<{ count: number }>(`${base}/exports/count`);
  }
  createExport(payload: { format?: string; fileUrl: string; documentId: number | string }) {
    return this.http.post<{ export: Export }>(`${base}/exports`, payload);
  }

  // ─── Public share view ───────────────────────────────────────────────────
  getSharedDocument(slug: string) {
    return this.http.get<{ document: Doc & { sections: (Section & { items: Item[] })[] } }>(`${base}/public/r/${slug}`);
  }
}
