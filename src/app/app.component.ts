import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { LoadingService } from './services/loading.service';

export const routeTransition = trigger('routeTransition', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(16px)' })
    ], { optional: true }),
    query(':enter', [
      animate('320ms cubic-bezier(0.4, 0, 0.2, 1)',
        style({ opacity: 1, transform: 'translateY(0)' }))
    ], { optional: true }),
  ])
]);

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule],
  animations: [routeTransition],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  isLoading = false;
  routeState = 0;
  scrolled = false;
  searchOpen = false;
  menuOpen = false;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private loadingService: LoadingService, private router: Router) {}

  ngOnInit() {
    this.loadingService.isLoading$.subscribe(v => this.isLoading = v);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.routeState++;
        this.searchOpen = false;
      }
    });
  }

  @HostListener('window:scroll')
  onScroll() {
    this.scrolled = window.scrollY > 20;
  }

  toggleSearch() {
    this.searchOpen = !this.searchOpen;
    if (this.searchOpen) {
      setTimeout(() => this.searchInput?.nativeElement?.focus(), 350);
    }
  }

  closeSearch(event: MouseEvent) {
    const panel = (event.target as HTMLElement).closest('.search-panel');
    if (!panel) this.searchOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  getRouteState(outlet: RouterOutlet) {
    return outlet.activatedRouteData?.['animation'] ?? this.routeState;
  }
}
