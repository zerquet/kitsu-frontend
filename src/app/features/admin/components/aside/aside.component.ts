import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'admin-aside',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  private router = inject(Router);
  authenticatedUser$ = inject(AuthService).authenticatedUser$;

  // segments: URL segments that belong to the tab, including its add page (e.g. /admin/add/episode)
  tabs = [
    { label: 'Anime', path: '/admin/anime', icon: 'bi-collection-play', segments: ['anime'] },
    { label: 'Episodes', path: '/admin/episodes', icon: 'bi-list-ol', segments: ['episodes', 'episode'] },
    { label: 'Franchises', path: '/admin/franchises', icon: 'bi-diagram-3', segments: ['franchises', 'franchise'] }
  ];

  activeTab$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects),
    startWith(this.router.url),
    map(url => {
      const urlSegments = url.split(/[/?#]/);
      return this.tabs.find(tab => tab.segments.some(s => urlSegments.includes(s)))?.label;
    })
  );
}
