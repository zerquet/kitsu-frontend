import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject,map, Observable, of, switchMap, tap } from 'rxjs';
import { Anime } from '../models/anime.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/animes`;
  private readonly franchiseBaseUrl = `${environment.apiUrl}/franchises`;
  
  private _animes$ = new BehaviorSubject<Anime[]>([]); //STATE

  constructor() {
    this.http.get<Anime[]>(`${this.baseUrl}`)
      .subscribe((animes) => {
        this._animes$.next(animes)
      });
  }

  getAnimes(): Observable<Anime[]> {
    return this._animes$;
  }

  //app store/state is not cache. don't get id from animes$ because state is not meant to be used as a cache, but rather to reduce API calls. query db instead for anime
  getAnimeById(animeId: number): Observable<Anime | undefined> {
    const anime = this._animes$.getValue().find((anime) => anime.id == animeId);
    
    if(anime !== undefined) {
      return of(anime);
    } 
    else {      
      return this.http.get<Anime>(`${this.baseUrl}/${animeId}`).pipe(
        tap((res) => {
          const updatedAnimes = this._animes$.getValue();
          updatedAnimes.push(res);
          this._animes$.next(updatedAnimes);
        })
      );
    }
  }

  //if app gets bigger, we may need to call APi directly...
  //and maybe hold a store for animes of a certain category? not sure how it'll work but i have an idea
  getAnimesByCategory(category: string): Observable<Anime[]> {    
    return this._animes$.pipe(
      map((animes) => {
        return animes.filter((anime) => {
          return anime.categories.some((c) => c.name === category)
        });
      }),
      switchMap((stateResults) => {
        const skipQueryString = stateResults.map(x => x.id.toString()).join(',');
        return this.http.get<Anime[]>(`${environment.apiUrl}/${category}/animes?skip=${skipQueryString}`,)
          .pipe(
            map((serverResults) => {
              return stateResults.concat(serverResults);
            })
          );
      })
    );
  }

  addAnime(req: FormData): Observable<Anime> {
    return this.http.post<Anime>(this.baseUrl, req)
      .pipe(
        tap((res) => {        
          const animes = this._animes$.getValue();
          animes.push(res);
          this._animes$.next(animes);
        })
      );
  }

  updateAnime(req: FormData): Observable<Anime> {
    return this.http.put<Anime>(this.baseUrl, req)
      .pipe(
        tap((res) => {
          const animes = this._animes$.getValue();
          animes[animes.findIndex((a) => a.id == res.id)] = res;
          this._animes$.next(animes);
        })
      );
  }

  //Refactor this. Consider search result model 
  miniSearch(term: string): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.baseUrl}/byTitle?term=${term}`);
  }

  advancedSearch(
    term?: string,
    minYear?: string | null,
    maxYear?: string | null,
    minRating?: string | null,
    maxRating?: string | null,
    minEpisodes?: string | null,
    maxEpisodes?: string | null,
    showTv?: boolean,
    showMovie?: boolean
  ): Observable<Anime[]> {
    let queryString = '/search?';
    queryString += `term=${term}`;
    if(minYear != null) queryString += `&minYear=${minYear}`;
    if(maxYear != null) queryString += `&maxYear=${maxYear}`;
    if(minRating != null) queryString += `&minRating=${minRating}`;
    if(maxRating != null) queryString += `&maxRating=${maxRating}`;
    if(minEpisodes != null) queryString += `&minEpisodes=${minEpisodes}`;
    if(maxEpisodes != null && maxEpisodes !== "100") queryString += `&maxEpisodes=${maxEpisodes}`;
    if(showTv == true || showMovie == true) {
      let mediaTypeString = "&mediaType=";
      let types = [];
      if(showTv == true) types.push("TV");
      if(showMovie == true) types.push("Movie");

      if(types.length > 1) mediaTypeString += types.join(',');
      if(types.length == 1) mediaTypeString += types[0];
      queryString += mediaTypeString;
    }

    return this.http
      .get<Anime[]>(`${this.baseUrl}${queryString}`);
  }

  //TODO move to franchise svc?
  getAnimesByFranchiseId(franchiseId: number): Observable<Anime[]> {
    return this._animes$.pipe(
      map((animes) => {
        return animes.filter((anime) => anime.franchiseId == franchiseId);
      }),
      switchMap((stateResults) => {
        const skipQueryString = stateResults.map(x => x.id.toString()).join(',');
        return this.http.get<Anime[]>(`${this.franchiseBaseUrl}/${franchiseId}/animes?skip=${skipQueryString}`)
          .pipe(
            map((serverResults) => {
              return stateResults.concat(serverResults);
            })
          );
      })
    );
  }
}
