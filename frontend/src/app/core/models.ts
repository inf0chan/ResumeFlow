export interface User {
  id: number;
  name: string;
  email: string;
  photo?: string | null;
}

export interface Template {
  id: number;
  name: string;
  config: string;
  createdAt: string;
  updatedAt: string;
}

export interface Doc {
  id: number;
  title: string;
  type: string;
  userId: number;
  templateId: number | null;
  template?: Template | null;
  authorName?: string | null;
  authorEmail?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  id: number;
  heading: string;
  position: number;
  documentId: number;
  items?: Item[];
  collapsed?: boolean;
}

export interface Item {
  id: number;
  content: string;
  position: number;
  sectionId: number;
}

export interface Version {
  id: number;
  label: string;
  snapshot: string;
  documentId: number;
  createdAt: string;
}

export type AppStatus = 'saved' | 'applied' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: number;
  company: string;
  role: string;
  status: AppStatus;
  documentId: number | null;
  document?: { id: number; title: string } | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Share {
  id: number;
  slug: string;
  documentId: number;
  document?: { id: number; title: string };
  createdAt: string;
}

export interface Export {
  id: number;
  format: string;
  fileUrl: string;
  documentId: number;
  document?: { id: number; title: string };
  userId: number;
  createdAt: string;
}
