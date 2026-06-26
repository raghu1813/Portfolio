import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { PersonInfo } from '../../models/portfolio.models';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class AboutComponent implements OnInit {
  private svc = inject(PortfolioService);
  person = signal<PersonInfo | null>(null);

  highlights = [
    { icon: 'fas fa-building',   label: 'Deloitte & ADP', sub: 'Global enterprise scale' },
    { icon: 'fas fa-brain',      label: 'LLM / GenAI',    sub: 'Natural language to SQL' },
    { icon: 'fas fa-cloud',      label: 'Azure Expert',   sub: '5 Microsoft certs' },
    { icon: 'fas fa-layer-group',label: 'Full Stack',      sub: '.NET · Angular · Azure' },
  ];

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.person.set(d.person));
  }
}
