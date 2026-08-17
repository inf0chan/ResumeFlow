import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="brand">ResumeFlow</span>
          <p>Helping job seekers build resumes that get results.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <a (click)="open('features')">Features</a>
          <a routerLink="/templates">Templates</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a (click)="open('about')">About</a>
          <a (click)="open('careers')">Careers</a>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <a (click)="open('faq')">FAQ</a>
          <a (click)="open('blog')">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <a href="https://github.com" target="_blank" rel="noopener">GitHub</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
      <div class="footer-bottom">&copy; {{ year }} ResumeFlow. Built by Himanshu Bisht. All rights reserved.</div>
    </footer>

    <div class="modal-overlay" *ngIf="activeModal" (click)="activeModal = ''">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <h2>{{ modalTitle }}</h2>
        <p class="sub" [innerHTML]="modalBody"></p>
        <div class="modal-actions" style="justify-content:center;">
          <button class="btn btn-primary" (click)="activeModal = ''">Got it</button>
        </div>
      </div>
    </div>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
  activeModal = '';
  modalTitle = '';
  modalBody = '';

  private content: Record<string, { title: string; body: string }> = {
    features: {
      title: 'Features',
      body: `
        <strong>Resume Builder</strong> — Create polished resumes with a live preview editor. Add sections, reorder content, and customize each document.<br><br>
        <strong>Template Library</strong> — Start from professionally designed templates and make them your own.<br><br>
        <strong>Version History</strong> — Save snapshots of your resume at any point. Roll back whenever you need to.<br><br>
        <strong>Application Tracker</strong> — Track every job application through saved, applied, interview, offer, and rejected stages on a visual pipeline board.<br><br>
        <strong>Sharing &amp; Exporting</strong> — Generate public share links and export to PDF with one click.
      `,
    },
    about: {
      title: 'About ResumeFlow',
      body: `ResumeFlow is a free, open-source resume builder and job application tracker. Built with Angular, Express.js, and MySQL, it gives job seekers full control over their documents without any subscription or paywall.<br><br>
        The project was created during a summer internship to demonstrate a full-stack CRUD application with real-world features like authentication, PDF exports, and application pipeline management.<br><br>
        <strong>Tech stack:</strong> Angular 18 &middot; Node.js &middot; Express &middot; MySQL &middot; Sequelize ORM &middot; JWT Auth &middot; bcrypt`,
    },
    careers: {
      title: 'Careers',
      body: `ResumeFlow is currently a solo project — there are no open positions at this time.<br><br>
        If you are interested in contributing as a developer, check out the project on GitHub. Pull requests and feature suggestions are always welcome!`,
    },
    faq: {
      title: 'Frequently Asked Questions',
      body: `
        <strong>Is ResumeFlow free?</strong><br>
        Yes — 100% free. No trials, no premium tier, no credit card required.<br><br>
        <strong>Where is my data stored?</strong><br>
        All data lives in your own MySQL database. Nothing is sent to any third-party cloud service.<br><br>
        <strong>Can I share my resume with others?</strong><br>
        Yes. Use the Sharing tab in the document editor to generate a public link anyone can view.<br><br>
        <strong>How do I export to PDF?</strong><br>
        Click the Export button in the document editor. The export event is recorded and the record appears on the Exports page.<br><br>
        <strong>Can I track job applications?</strong><br>
        Yes — use the Applications page to track companies, roles, and status through a kanban-style pipeline board.`,
    },
    blog: {
      title: 'Blog',
      body: `ResumeFlow does not have a blog yet, but here are some tips to get you started:<br><br>
        <strong>Tip 1:</strong> Tailor your resume for each application — mirror keywords from the job description.<br><br>
        <strong>Tip 2:</strong> Keep your resume to one page unless you have 10+ years of relevant experience.<br><br>
        <strong>Tip 3:</strong> Use action verbs ("Built", "Led", "Reduced") instead of passive phrases ("Responsible for").<br><br>
        <strong>Tip 4:</strong> Save different versions of your resume so you can quickly adapt for different roles.`,
    },
  };

  open(key: string) {
    const c = this.content[key];
    if (c) {
      this.modalTitle = c.title;
      this.modalBody = c.body;
      this.activeModal = key;
    }
  }
}
