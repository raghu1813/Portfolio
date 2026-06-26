import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Experience } from '../../models/portfolio.models';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.html',
  styleUrl: './experience.scss'
})
export class ExperienceComponent implements OnInit {
  private svc = inject(PortfolioService);
  experiences = signal<Experience[]>([]);
  activeIdx = signal(0);

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.experiences.set(d.experiences));
  }
}
