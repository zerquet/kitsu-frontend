import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AnimeDetail } from '../../../shared/models/anime.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/animes`;
  private _animes$ = new BehaviorSubject<AnimeDetail[]>([]); //STATE
  
  constructor() {
    this.http.get<AnimeDetail[]>(`${this.baseUrl}`)
      .subscribe((animes) => {
        this._animes$.next(animes)
      });
  }

  addAnime(req: FormData): Observable<AnimeDetail> {
    return this.http.post<AnimeDetail>(this.baseUrl, req)
      .pipe(
        tap((res) => {
          const animes = this._animes$.getValue();
          animes.push(res);
          this._animes$.next(animes);
        })
      );
  }

  updateAnime(req: FormData): Observable<AnimeDetail> {
    return this.http.put<AnimeDetail>(this.baseUrl, req)
      .pipe(
        tap((res) => {
          const animes = this._animes$.getValue();
          animes[animes.findIndex((a) => a.id == res.id)] = res;
          this._animes$.next(animes);
        })
      );
  }

  getAnimes(): Observable<AnimeDetail[]> {
    return this._animes$;
  }
}
