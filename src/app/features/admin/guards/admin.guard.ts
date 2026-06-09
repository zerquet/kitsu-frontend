import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, of } from 'rxjs';
import { AuthService } from '../../../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): Observable<boolean> {
    return this.authService.authenticatedUser$.pipe(
      map((user) => {
        console.log(user);

        if (user && user.isAdmin === true) {
          return true;
        }
        this.authService.isAdminPage$.next(false); //can this be made more elegant?
        this.router.navigate(['/explore']);
        return false;
      })
    );

  }
}
