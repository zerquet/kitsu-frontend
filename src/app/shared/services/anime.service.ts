import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Anime } from '../models/anime.model';
import { AppToastService } from './app-toast.service';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private toastService = inject(AppToastService);
  private readonly baseUrl = 'https://localhost:7017/api/animes';
  
  private _animes$ = new BehaviorSubject<Anime[]>([]); //STATE

  constructor() {
    this.http
      .get<Anime[]>(`${this.baseUrl}`)
      .subscribe((animes) => {
        this._animes$.next(animes)
      });
  }

  getAnimes(): Observable<Anime[]> {
    return this._animes$;
  }

  //app store/state is not cache. don't get id from animes$ because state is not meant to be used as a cache, but rather to reduce API calls. query db instead for anime
  getAnime(id: number): Observable<Anime | undefined> {
    const anime = this._animes$.getValue().find((a) => a.id == id);
    
    if(anime?.details) {
      return of(anime);
    } 
    else {      
      return this.http.get<Anime>(`${this.baseUrl}/${id}`).pipe(
        tap((anime) => {          
          const updatedAnimes = this._animes$.getValue().map(a => 
            a.id == id ? {a, ...anime} : a //AGAIN, == works for us but not ===. are they not both numbers????
          );          
          this._animes$.next(updatedAnimes);
        })
      )
      // return this._animes$.pipe(
      //   switchMap((animes) => {
      //     return of(animes.find((anime) => anime.id == id)) //triple '=' doesn't work
      //   })
      // )
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
      })
    );
  }

  addAnime(data: FormData) { //return id?
    this.http.post<number>(this.baseUrl, data)
      .subscribe({
        next: (id: number) => {
          this.toastService.show("Success!", "Anime added.");
          
          const animes = this._animes$.getValue();
          let anime: Anime = {
            id: id,
            title: data.get('title')?.toString()!,
            description: data.get('description')?.toString()!,
            imageUrl: '',
            year: null,
            score: Number(data.get('score')),
            categories: [],
            details: {
              animeId: id,
              releaseStatus: null,
              coverImageUrl: '',
              episodeCount: null,
              mediaType: null,
              englishTitle: null,
              japaneseTitle: null,
              japaneseTitleRomaji: null,
              season: null,
              startAirDate: null,
              endAirDate: null,
              tvRating: null,
              episodeLength: null,
              franchiseId: null,
              franchiseName: null
            }
          }
          animes.push(anime)
        },
        error: (err) => this.toastService.show("Error!", "Could not add anime.")
      });
  }

  updateAnime(data: FormData): Observable<void> {
    return this.http
      .put<void>(this.baseUrl, data);
  }

  //search state instead?
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
    let queryString = '/AdvancedSearch?';
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

  getAnimesByFranchise(id: number): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.baseUrl}/GetByFranchise/${id}`);
  }

  getDummydata(): Observable<Anime[]> {
    return this.http
      .get<Anime[]>('/api/data.json')
      .pipe(shareReplay(1));
  }
}
