import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/services/auth.service';
import { UserProfile } from '../models/user-profile.model';
import { GetUserProfileResponseDto } from '../../features/user/dtos/get-user-profile-response.dto';
import { mapGetUserProfileToUserProfile, mapUpdateUserProfileToUserProfile } from '../mappers/user-profile.mapper';
import { UpdateUserProfileResponseDto } from '../../features/user/dtos/update-user-profile-response.dto';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private _profileSubject = new BehaviorSubject<UserProfile | null>(null);

  profile$ = this._profileSubject.asObservable();
  //profile$ = new BehaviorSubject<UserProfile | null>(null);
  canEdit$ = combineLatest([
    this.profile$,
    this.authService.authenticatedUser$
  ]).pipe(
    map(([authenticatedUser, userProfile]) => {
      //console.log("authed user: " + authenticatedUser + " and current user " + userProfile);
      if (!authenticatedUser || !userProfile) {
        return false;
      }

      return authenticatedUser.id === userProfile.id;
    })
  )

  constructor() { }

  /**
   * Loads profile by calling API using user's display ID
   * @param userDisplayId the user's display ID
   */
  loadProfile(userDisplayId: string) {
    this.http.get<GetUserProfileResponseDto>(`${this.baseUrl}/${userDisplayId}`)
      .pipe(map(mapGetUserProfileToUserProfile))
      .subscribe({
        next: (userProfile) => this._profileSubject.next(userProfile)
      });
  }

  /**
   * Sets profile directly (no API call) if you already have the user profile data
   * @param userProfile the profile object
   */
  setProfile(userProfile: UserProfile) {
    this._profileSubject.next(userProfile);
  }

  updateProfile(req: FormData): Observable<UpdateUserProfileResponseDto> {
    return this.http.put<UserProfile>(`${this.baseUrl}`, req)
      .pipe(
        map(mapUpdateUserProfileToUserProfile),
        tap((userProfile) => {
          this._profileSubject.next(userProfile);
          this.authService.updateAuthenticatedUser(userProfile);
        })
      );
  }
}
