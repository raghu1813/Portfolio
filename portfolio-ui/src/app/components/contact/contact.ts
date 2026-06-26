import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioService } from '../../services/portfolio.service';
import { ContactRequest } from '../../models/portfolio.models';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class ContactComponent {
  private svc = inject(PortfolioService);

  form: ContactRequest = { name: '', email: '', subject: '', message: '' };
  sending    = signal(false);
  success    = signal(false);
  error      = signal('');

  contactInfo = [
    { icon: 'fas fa-envelope', label: 'Email',    value: 'raghurm.kaligotla@gmail.com',             href: 'mailto:raghurm.kaligotla@gmail.com' },
    { icon: 'fas fa-phone',    label: 'Phone',    value: '+91 9553663307',                          href: 'tel:+919553663307' },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', value: 'linkedin.com/in/raghu-ram-kaligotla',     href: 'https://www.linkedin.com/in/raghu-ram-kaligotla/' },
    { icon: 'fab fa-github',   label: 'GitHub',   value: 'github.com/raghu1813',                    href: 'https://github.com/raghu1813' },
    { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Hyderabad, Telangana',             href: '' },
  ];

  submit() {
    if (!this.form.name || !this.form.email || !this.form.message) {
      this.error.set('Please fill in all required fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email)) {
      this.error.set('Please enter a valid email address.');
      return;
    }

    this.error.set('');
    this.sending.set(true);

    this.svc.sendContact(this.form).subscribe({
      next: (res) => {
        if (res.success) {
          this.success.set(true);
          this.form = { name: '', email: '', subject: '', message: '' };
          setTimeout(() => this.success.set(false), 6000);
        } else {
          this.error.set(res.message);
        }
        this.sending.set(false);
      },
      error: () => {
        this.error.set('Could not reach the server. Please email me directly at raghurm.kaligotla@gmail.com');
        this.sending.set(false);
      }
    });
  }
}
