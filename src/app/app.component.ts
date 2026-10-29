import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { NavMenuComponent } from './core/layout/nav-menu/nav-menu.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, ToastComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kitsu-frontend';
  constructor(public authService: AuthService, private router: Router) { }
  ngOnInit(): void {
    this.authService.isAdminPage$.next(window.location.pathname.startsWith('/admin'));

    // Re-check on every navigation so the site nav hides when entering admin from within the app
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => this.authService.isAdminPage$.next(event.urlAfterRedirects.startsWith('/admin')));
  }
}
