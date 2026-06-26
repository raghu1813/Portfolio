import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';
import { PersonInfo } from '../../models/portfolio.models';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnInit {
  private svc = inject(PortfolioService);
  person = signal<PersonInfo | null>(null);
  typedText = signal('');

  private titles = ['Full Stack Developer', '.NET & Angular Expert', 'Azure Cloud Engineer', 'AI Integration Enthusiast'];
  private titleIdx = 0;

  ngOnInit() {
    this.svc.getPortfolio().subscribe(d => this.person.set(d.person));
    this.startTyping();
  }

  private startTyping() {
    const typeTitle = (title: string, pos: number) => {
      if (pos <= title.length) {
        this.typedText.set(title.slice(0, pos));
        setTimeout(() => typeTitle(title, pos + 1), 65);
      } else {
        setTimeout(() => eraseTitle(title, title.length), 2200);
      }
    };

    const eraseTitle = (title: string, pos: number) => {
      if (pos >= 0) {
        this.typedText.set(title.slice(0, pos));
        setTimeout(() => eraseTitle(title, pos - 1), 40);
      } else {
        this.titleIdx = (this.titleIdx + 1) % this.titles.length;
        setTimeout(() => typeTitle(this.titles[this.titleIdx], 0), 400);
      }
    };

    typeTitle(this.titles[0], 0);
  }

  scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
