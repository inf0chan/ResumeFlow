import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-brand">
          <span class="brand">ResumeFlow</span>
          <p>Helping job seekers build resumes that get results.</p>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <a href="#">Features</a>
          <a routerLink="/templates">Templates</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="#">About</a>
          <a href="#">Careers</a>
        </div>
        <div class="footer-col">
          <h4>Resources</h4>
          <a href="#">FAQ</a>
          <a href="#">Blog</a>
        </div>
        <div class="footer-col">
          <h4>Connect</h4>
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
        </div>
      </div>
      <div class="footer-bottom">© {{ year }} ResumeFlow. Built by Himanshu Bisht. All rights reserved.</div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
