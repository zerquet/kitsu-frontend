import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavMenuComponent } from './core/layout/nav-menu/nav-menu.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AuthService } from './core/auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavMenuComponent, ToastComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'kitsu-client';
  constructor(public authService: AuthService) {}
  ngOnInit(): void {
    // this.authService.getUser().subscribe(res => {
    //   this.authService.currentUser$.next(res);
    //   console.log("app")
    //   console.log(this.authService.currentUser$.value);
    // })
    
    if(window.location.pathname.includes('admin')) {
      this.authService.isAdminPage$.next(true);
    }
    else {
      this.authService.isAdminPage$.next(false);
    }
  }
}
