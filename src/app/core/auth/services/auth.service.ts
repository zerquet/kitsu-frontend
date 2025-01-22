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
    // this.getUser().subscribe(res => {
    //   this.currentUser$.next(res);
    // })
    this.decodeToken();
  }

  loggedUserId$ = new BehaviorSubject<string | null>(null);
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  currentUser$ = new BehaviorSubject<User | null>(null);
  isAdminPage$ = new BehaviorSubject<boolean>(false);

  login(request: LoginDto): Observable<User> {
    return this.http
      .post<User>(`${this.baseUrl}/auth/login`, request)
  }

  getUser(): Observable<User | null> {
    return this.http
      .get<User | null>(`${this.baseUrl}/user`);
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
      this.loggedUserId$.next(decoded.nameid);
      this.isLoggedIn$.next(true);
    }
  }
}
