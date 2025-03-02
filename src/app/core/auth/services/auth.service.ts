import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoginDto } from '../loginDto.model';
import { User } from '../user.model';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../jwtPayload.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7017/api";

  constructor() {
    this.decodeToken();
    //console.log(this.currentUser$.getValue());
    
  }

  loggedUserId$ = new BehaviorSubject<string | null>(null);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<User | null>(null);
  isAdminPage$ = new BehaviorSubject<boolean>(false); //variable to turn off nav menu in admin dashboard

  login(request: LoginDto): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/auth/login`, request)
  }

  get isLoggedIn() {
    let loggedIn = this.loggedUserId$.value !== null;
    return of(loggedIn);
  }

  logout() {
    localStorage.setItem("access_token", "");
    this.loggedUserId$.next(null)
    this.isLoggedIn$.next(false);
    this.currentUser$.next(null);
  }

  //when user logs in
  setUser(user: User) {
    this.currentUser$.next(user); 
  }
  //when user logs in
  setToken(token: string) {
    localStorage.setItem("access_token", token);
  }
  //local method; can be static
  decodeToken() {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      var loggedUser: User = {
        id: decoded.nameid,
        username: decoded.given_name,
        email: decoded.email,
        token: token,
        isAdmin: decoded.is_admin === "True" ? true : false
      };
      //need to check whats really needed below now that i got this user object with isadmin
      this.currentUser$.next(loggedUser);
      this.loggedUserId$.next(decoded.nameid);
      this.isLoggedIn$.next(true);
    }
  }
}
