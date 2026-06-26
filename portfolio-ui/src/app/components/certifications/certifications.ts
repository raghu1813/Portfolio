import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Certification } from '../../models/portfolio.models';

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './certifications.html',
  styleUrl: './certifications.scss'
})
export class CertificationsComponent implements OnInit {
  private svc = inject(PortfolioService);
  certs = signal<Certification[]>([]);

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.certs.set(d.certifications));
  }

  codeColor(code: string): string {
    if (code.startsWith('AI')) return 'purple';
    if (code.startsWith('AZ')) return 'blue';
    return 'green';
  }
}
