import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { Education } from '../../models/portfolio.models';

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './education.html',
  styleUrl: './education.scss'
})
export class EducationComponent implements OnInit {
  private svc = inject(PortfolioService);
  educations = signal<Education[]>([]);

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.educations.set(d.educations));
  }
}
