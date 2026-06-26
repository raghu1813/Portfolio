import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NavLink { label: string; anchor: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  scrolled = signal(false);
  menuOpen = signal(false);

  links: NavLink[] = [
    { label: 'About',          anchor: '#about' },
    { label: 'Skills',         anchor: '#skills' },
    { label: 'Experience',     anchor: '#experience' },
    { label: 'Education',      anchor: '#education' },
    { label: 'Certifications', anchor: '#certifications' },
    { label: 'Contact',        anchor: '#contact' }
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled.set(window.scrollY > 40);
  }

  navigate(anchor: string) {
    this.menuOpen.set(false);
    document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
  }
}
