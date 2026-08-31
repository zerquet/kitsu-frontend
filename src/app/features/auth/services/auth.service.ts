import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginRequest } from '../loginRequest.model';
import { AuthenticatedUser } from '../authenticatedUser.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwtPayload.model';
import { environment } from '../../../../environments/environment';
import { Utils } from '../../../core/services/utils';
import { Router } from '@angular/router';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { UserProfile } from '../../../shared/models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}`;
  private _tokenIsDecoded = false;
  private currentUserSubject = new BehaviorSubject<AuthenticatedUser | null>(null);

  constructor() {
    if (this._tokenIsDecoded === false) {
      this.decodeToken();
    }
  }

  authenticatedUser$ = this.currentUserSubject.asObservable();
  isAdminPage$ = new BehaviorSubject<boolean>(false); //variable to turn off nav menu in admin dashboard

  login(req: LoginRequest) {
    return this.http.post<LoginResponseDto>(`${this.baseUrl}/auth/login`, req)
      .pipe(
        tap((res) => {
          localStorage.setItem("access_token", res.token);
          if (!res.user) {
            this.currentUserSubject.next(null);
            return;
          }
          res.user.isAdmin = res.isAdmin
          this.currentUserSubject.next(res.user);
        })
      );
  }

  logout() {
    localStorage.setItem("access_token", "");
    this.currentUserSubject.next(null);
    this.router.navigate(['/explore'])
  }

  decodeToken() {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!Utils.JwtTokenIsExpired(decoded.exp)) {
        /*Sets authenticated user state using JWT token */
        var authenticatedUser: AuthenticatedUser = {
          id: decoded.nameid,
          displayId: decoded.display_id,
          userName: decoded.given_name,
          email: decoded.email,
          isAdmin: decoded.is_admin === "True" ? true : false,
          profilePhotoId: decoded.profile_photo_id,
          coverPhotoId: decoded.cover_photo_id,
          location: '',
          bio: '',
          birthday: undefined,
          gender: ''
        };
        this.currentUserSubject.next(authenticatedUser);
        this._tokenIsDecoded = true;
      }
      else {
        this.logout();
      }
    }
  }

  updateAuthenticatedUser(updatedUser: UserProfile) {
    let currentUser = this.currentUserSubject.getValue();
    if (currentUser === null) {
      return;
    }

    currentUser.bio = updatedUser.bio;
    currentUser.birthday = updatedUser.birthday;
    currentUser.coverPhotoId = updatedUser.coverPhotoId;
    currentUser.gender = updatedUser.gender;
    currentUser.location = updatedUser.location;
    currentUser.profilePhotoId = updatedUser.profilePhotoId;

    this.currentUserSubject.next(currentUser);
  }
}
