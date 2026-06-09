import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
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
  private profileSubject = new BehaviorSubject<UserProfile | null>(null);

  profile$ = this.profileSubject.asObservable();
  //profile$ = new BehaviorSubject<UserProfile | null>(null);
  canEdit$ = combineLatest([
    this.profile$,
    this.authService.authenticatedUser$
  ]).pipe(
    map(([authenticatedUser, userProfile]) => {
      if (!authenticatedUser || !userProfile) {
        return false;
      }

      return authenticatedUser.id === userProfile.id;
    })
  )

  constructor() { }

  loadProfile(userDisplayId: string) {
    this.http.get<UserProfile>(`${this.baseUrl}/${userDisplayId}`)
      .subscribe({
        next: (res) => this.profileSubject.next(res)
      });
  }

  updateProfile(req: FormData): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}`, req)
      .pipe(
        tap((res) => {
          this.profileSubject.next(res);
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
