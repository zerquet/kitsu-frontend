import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LoginRequest } from '../loginRequest.model';
import { AuthenticatedUser } from '../authenticatedUser.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwtPayload.model';
import { environment } from '../../../../environments/environment';
import { Utils } from '../../../core/services/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;
  private _tokenIsDecoded = false;

  constructor() {
    if (this._tokenIsDecoded === false) {
      this.decodeToken();
    }
  }

  authenticatedUser$ = new BehaviorSubject<AuthenticatedUser | null>(null);
  isAdminPage$ = new BehaviorSubject<boolean>(false); //variable to turn off nav menu in admin dashboard

  login(req: LoginRequest) {
    return this.http.post<AuthenticatedUser>(`${this.baseUrl}/auth/login`, req)
      .pipe(
        tap((res) => {
          localStorage.setItem("access_token", res.token);
          this.authenticatedUser$.next(res);
        })
      );
  }

  logout() {
    localStorage.setItem("access_token", "");
    this.authenticatedUser$.next(null);
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
          username: decoded.given_name,
          email: decoded.email,
          token: token,
          isAdmin: decoded.is_admin === "True" ? true : false,
          profilePhotoId: decoded.profile_photo_id,
          coverPhotoId: decoded.cover_photo_id,
          location: '',
          bio: '',
          birthday: undefined,
          gender: ''
        };
        this.authenticatedUser$.next(authenticatedUser);
        this._tokenIsDecoded = true;
      }
      else {
        this.logout();
      }
    }
  }
}
