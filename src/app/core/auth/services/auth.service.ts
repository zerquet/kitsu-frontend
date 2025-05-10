import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginDto } from '../loginDto.model';
import { CurrentUser } from '../user.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwtPayload.model';
import { environment } from '../../../../environments/environment';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { Utils } from '../../services/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;
  private _tokenIsDecoded = false;

  constructor() {
    if(!this._tokenIsDecoded) {
      this.decodeToken();
      //not injecting UserService. Getting profile and cover Ids from API instead of JWT token.
      this.http.get<UserProfile>(`${environment.apiUrl}/users/${this.currentUser$.getValue()!.id}`).subscribe((res) => {
        let currentUser = this.currentUser$.getValue();

        if (currentUser !== null) {
          currentUser.profilePhotoId = res.profilePhotoId;
          currentUser.coverPhotoId = res.coverPhotoId;
        }

        this.currentUser$.next(currentUser);
      })
    }
  }

  currentUser$ = new BehaviorSubject<CurrentUser | null>(null);
  isAdminPage$ = new BehaviorSubject<boolean>(false); //variable to turn off nav menu in admin dashboard

  //calls setUser() and setToken()
  login(request: LoginDto): Observable<CurrentUser> {
    return this.http
      .post<CurrentUser>(`${this.baseUrl}/auth/login`, request)
  }

  logout() {
    localStorage.setItem("access_token", "");
    this.currentUser$.next(null);
  }

  //when user logs in
  setUser(user: CurrentUser) {
    this.currentUser$.next(user); 
  }
  //when user logs in
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  }
  //local method; can be static
  decodeToken() {
    debugger;
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!Utils.JwtTokenIsExpired(decoded.exp)) {  
        var currentUser: CurrentUser = {
          id: decoded.nameid,
          username: decoded.given_name,
          email: decoded.email,
          token: token,
          isAdmin: decoded.is_admin === "True" ? true : false,
          profilePhotoId: decoded.profile_photo_id,
          coverPhotoId: decoded.cover_photo_id,
          location: '',
          bio: '',
          birthday: null,
          gender: ''
        };
        //need to check whats really needed below now that i got this user object with isadmin
        this.currentUser$.next(currentUser);
        this._tokenIsDecoded = true;
      }
      else {
        this.logout();
      }
    }
  }
}
