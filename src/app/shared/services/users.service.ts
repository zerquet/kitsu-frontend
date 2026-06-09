import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserProfile } from '../models/userProfile.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  profile$ = new BehaviorSubject<UserProfile | null>(null);

  constructor() { }

  loadProfile(userDisplayId: string) {
    this.http.get<UserProfile>(`${this.baseUrl}/${userDisplayId}`)
      .subscribe({
        next: (res) => this.profile$.next(res)
      });
  }

  updateProfile(req: FormData): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}`, req)
      .pipe(
        tap((res) => {
          this.profile$.next(res);
          const currentAuthenticatedUser = this.authService.authenticatedUser$.getValue();
          if (currentAuthenticatedUser !== null) {
            currentAuthenticatedUser.bio = res.bio;
            currentAuthenticatedUser.birthday = res.birthday;
            currentAuthenticatedUser.coverPhotoId = res.coverPhotoId;
            currentAuthenticatedUser.gender = res.gender;
            currentAuthenticatedUser.location = res.location;
            currentAuthenticatedUser.profilePhotoId = res.profilePhotoId;
          }
          this.authService.authenticatedUser$.next(currentAuthenticatedUser);
        })
      );
  }
}
