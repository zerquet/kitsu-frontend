import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { Anime, AnimeDetails } from '../models/anime.model';
import { AppToastService } from './app-toast.service';
import { Category } from '../models/category.model';
import { Franchise } from '../models/franchise.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private toastService = inject(AppToastService);
  private readonly baseUrl = `${environment.apiUrl}/animes`;
  private readonly franchiseBaseUrl = `${environment.apiUrl}/franchises`
  
  private _animes$ = new BehaviorSubject<Anime[]>([]); //STATE

  constructor() {
    this.http
      .get<Anime[]>(`${this.baseUrl}`)
      .subscribe((animes) => {
        this._animes$.next(animes)
      });
  }

  getAnimes(): Observable<Anime[]> { //check if null, call api conditionally
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

  addAnime(data: FormData, franchise?: Franchise): Observable<{animeId: number, imageUrl: string, coverImageUrl: string}> { //return id?
    return this.http.post<{animeId: number, imageUrl: string, coverImageUrl: string}>(this.baseUrl, data).pipe(
      tap((res) => {        
        const animes = this._animes$.getValue();

        let details: AnimeDetails = {
          animeId: Number(data.get('id')),
          releaseStatus: data.get('releaseStatus') !== null ? data.get('releaseStatus')!.toString() : '',
          coverImageUrl: data.get('coverImage') !== null ? res.coverImageUrl : '',
          episodeCount: Number(data.get('episodeCount')),
          mediaType: data.get('mediaType') !== null ? data.get('mediaType')!.toString() : null,
          englishTitle: data.get('englishTitle') !== null ? data.get('englishTitle')!.toString() : null,
          japaneseTitle: data.get('japaneseTitle') !== null ? data.get('japaneseTitle')!.toString() : null,
          japaneseTitleRomaji: data.get('japaneseTitleRomaji') !== null ? data.get('japaneseTitleRomaji')!.toString() : null,
          season: data.get('season') !== null ? data.get('season')!.toString() : null,
          startAirDate: data.get('startAirDate') !== null ? data.get('startAirDate') as unknown as Date : null,
          endAirDate: data.get('endAirDate') !== null ? data.get('endAirDate') as unknown as Date : null,
          tvRating: data.get('tvRating') !== null ? data.get('tvRating')!.toString() : null,
          episodeLength: Number(data.get('episodeLength')),
          franchiseId: franchise === undefined ? null : Number(data.get('franchiseId')),
          franchiseName: franchise == undefined ? null : franchise!.name
        }

        let anime: Anime = {
          id: res.animeId,
          title: data.get('title')!.toString(),
          description: data.get('description') !== null ? data.get('description')!.toString() : '',
          imageUrl: data.get('image') !== null ? res.imageUrl : '',
          year: Number(data.get('year')),
          score: Number(data.get('score')),
          categories: data.getAll('categories').map((category): Category => ({
            id: Number(category),
            name: null,
            description: null
          })),
          details: details
        }

        animes.push(anime);

        this._animes$.next(animes);
      }));
  }

  updateAnime(data: FormData, franchise?: Franchise): Observable<{imageUrl: string, coverImageUrl: string}> { //update state
    return this.http.put<{imageUrl: string, coverImageUrl: string}>(this.baseUrl, data).pipe(
      tap((res) => {
        //res contains the response containing new images (the urls). app needs to restart in order for them to load. 
        //reason to move media to another host.
        const animeList = this._animes$.getValue();
        let oldAnimeIdx = animeList.findIndex((a) => a.id === Number(data.get('id')));
        let oldAnime = animeList[oldAnimeIdx];
        
        let details: AnimeDetails = {
          animeId: Number(data.get('id')),
          releaseStatus: data.get('releaseStatus') !== null ? data.get('releaseStatus')!.toString() : '',
          coverImageUrl: data.get('coverImage') !== null ? res.coverImageUrl : oldAnime.details.coverImageUrl,
          episodeCount: Number(data.get('episodeCount')),
          mediaType: data.get('mediaType') !== null ? data.get('mediaType')!.toString() : null,
          englishTitle: data.get('englishTitle') !== null ? data.get('englishTitle')!.toString() : null,
          japaneseTitle: data.get('japaneseTitle') !== null ? data.get('japaneseTitle')!.toString() : null,
          japaneseTitleRomaji: data.get('japaneseTitleRomaji') !== null ? data.get('japaneseTitleRomaji')!.toString() : null,
          season: data.get('season') !== null ? data.get('season')!.toString() : null,
          startAirDate: data.get('startAirDate') !== null ? data.get('startAirDate') as unknown as Date : null,
          endAirDate: data.get('endAirDate') !== null ? data.get('endAirDate') as unknown as Date : null,
          tvRating: data.get('tvRating') !== null ? data.get('tvRating')!.toString() : null,
          episodeLength: Number(data.get('episodeLength')),
          franchiseId: franchise === undefined ? null : Number(data.get('franchiseId')),
          franchiseName: franchise == undefined ? null : franchise!.name
        }

        let anime: Anime = {
          id: Number(data.get('id')),
          title: data.get('title')!.toString(),
          description: data.get('description') !== null ? data.get('description')!.toString() : '',
          imageUrl: data.get('image') !== null ? res.imageUrl : oldAnime.imageUrl,
          year: Number(data.get('year')),
          score: Number(data.get('score')),
          categories: data.getAll('categories').map((category): Category => ({
            id: Number(category),
            name: null,
            description: null
          })),
          details: details
        }
        //console.log(data);
        
        console.log(data.getAll('categories'));
        console.log(data.get('image'));
        console.log(data.get('coverImage'));
        
        console.log(anime);

        animeList[oldAnimeIdx] = anime;

        this._animes$.next(animeList);
      })
    )
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
  getAnimesByFranchise(id: number): Observable<Anime[]> {
    return this.http
      .get<Anime[]>(`${this.franchiseBaseUrl}/${id}/animes`);
  }

  getDummydata(): Observable<Anime[]> {
    return this.http
      .get<Anime[]>('/api/data.json')
      .pipe(shareReplay(1));
  }
}
