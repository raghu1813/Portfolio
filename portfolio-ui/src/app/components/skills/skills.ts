import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Skill } from '../../models/portfolio.models';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class SkillsComponent implements OnInit {
  private svc = inject(PortfolioService);
  skills = signal<Skill[]>([]);

  categoryIcons: Record<string, string> = {
    'Languages':         'fas fa-code',
    'Frontend':          'fas fa-palette',
    'Backend':           'fas fa-server',
    'Cloud & DevOps':    'fas fa-cloud',
    'AI & Applied Tech': 'fas fa-brain',
    'Reporting':         'fas fa-chart-bar'
  };

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.skills.set(d.skills));
  }

  iconFor(category: string): string {
    return this.categoryIcons[category] ?? 'fas fa-tools';
  }
}
