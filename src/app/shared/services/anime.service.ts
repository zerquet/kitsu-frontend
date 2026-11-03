import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, switchMap, tap } from 'rxjs';
import { Anime, AnimeDetail } from '../models/anime.model';
import { environment } from '../../../environments/environment';
import { GetAnimeByIdResponseDto } from '../../features/anime/dtos/get-anime-by-id-response.dto';
import { AnimeResponseItemDto, AnimeSearchResultResponseDto, GetExploreAnimeResponseDto } from '../../features/anime/dtos/get-explore-anime-response.dto';
import { mapAnimeResponseItemToAnime, mapGetAnimeByIdToAnimePage, mapGetExploreAnimeToExplorePage, mapSearchResultToAnime } from '../mappers/anime.mapper';
import { ExplorePageModel } from '../../features/anime/models/explore-page.model';
import { AnimePageModel } from '../../features/anime/models/anime-page.model';
import { GetMediaReactionByAnimeResponseDto } from '../../features/anime/dtos/get-media-reaction-by-anime-response.dto';
import { MediaReaction, MediaReactionTableRow } from '../models/media-reaction.model';
import { mapGetMediaReactionByAnimeToMediaReaction } from '../mappers/media-reaction.mapper';

@Injectable({
  providedIn: 'root'
})
export class AnimeService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/animes`;
  private readonly franchiseBaseUrl = `${environment.apiUrl}/franchises`;
  private animeReactionsSubject = new BehaviorSubject<MediaReactionTableRow[]>([]);
  animeReactions$ = this.animeReactionsSubject.asObservable();

  //private _animes$ = new BehaviorSubject<AnimeDetail[]>([]); //STATE

  getExploreAnime(category?: string): Observable<ExplorePageModel> {
    const url = category 
      ? `${this.baseUrl}/explore?category=${category}` 
      : `${this.baseUrl}/explore`;
    return this.http.get<GetExploreAnimeResponseDto>(url)
      .pipe(map(mapGetExploreAnimeToExplorePage));
  }

  getExploreAnimeByCollection(collection: string, category?: string): Observable<Anime[]> {
    const url = category
      ? `${this.baseUrl}/explore/${collection}?category=${category}` 
      : `${this.baseUrl}/explore/${collection}`;
    return this.http.get<AnimeResponseItemDto[]>(url)
      .pipe(map(animes => {
        return animes.map(mapAnimeResponseItemToAnime)
      }))
  }

  //app store/state is not cache. don't get id from animes$ because state is not meant to be used as a cache, but rather to reduce API calls. query db instead for anime
  getAnimeById(animeId: number): Observable<AnimePageModel | undefined> {  
    return this.http.get<GetAnimeByIdResponseDto>(`${this.baseUrl}/${animeId}`)
      .pipe(map(mapGetAnimeByIdToAnimePage));
  }

  //if app gets bigger, we may need to call APi directly...
  //and maybe hold a store for animes of a certain category? not sure how it'll work but i have an idea
  // getAnimesByCategory(category: string): Observable<AnimeDetail[]> {
  //   return this._animes$.pipe(
  //     map((animes) => {
  //       return animes.filter((anime) => {
  //         return anime.categories.some((c) => c.name === category)
  //       });
  //     }),
  //     switchMap((stateResults) => {
  //       const skipQueryString = stateResults.map(x => x.id.toString()).join(',');
  //       return this.http.get<AnimeDetail[]>(`${environment.apiUrl}/${category}/animes?skip=${skipQueryString}`,)
  //         .pipe(
  //           map((serverResults) => {
  //             return stateResults.concat(serverResults);
  //           })
  //         );
  //     })
  //   );
  // }

  //Refactor this. Consider search result model 
  getAnimeByTitle(term: string): Observable<Anime[]> {
    return this.http.get<Anime[]>(`${this.baseUrl}/byTitle?term=${term}`);
  }

  searchAnime(
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
    queryString += `term=${term ?? ''}`;
    if (minYear != null) queryString += `&minYear=${minYear}`;
    if (maxYear != null) queryString += `&maxYear=${maxYear}`;
    if (minRating != null) queryString += `&minRating=${minRating}`;
    if (maxRating != null) queryString += `&maxRating=${maxRating}`;
    if (minEpisodes != null) queryString += `&minEpisodes=${minEpisodes}`;
    if (maxEpisodes != null) queryString += `&maxEpisodes=${maxEpisodes}`;
    if (showTv == true || showMovie == true) {
      let mediaTypeString = "&mediaType=";
      let types = [];
      if (showTv == true) types.push("TV");
      if (showMovie == true) types.push("Movie");

      if (types.length > 1) mediaTypeString += types.join(',');
      if (types.length == 1) mediaTypeString += types[0];
      queryString += mediaTypeString;
    }
    return this.http.get<AnimeSearchResultResponseDto[]>(`${this.baseUrl}${queryString}`)
      .pipe(map(animeResults => {
        return animeResults.map(mapSearchResultToAnime)
      }));
  }

  //TODO move to franchise svc?
  // getAnimesByFranchiseId(franchiseId: number): Observable<AnimeDetail[]> {
  //   return this._animes$.pipe(
  //     map((animes) => {
  //       return animes.filter((anime) => anime.franchiseId == franchiseId);
  //     }),
  //     switchMap((stateResults) => {
  //       const skipQueryString = stateResults.map(x => x.id.toString()).join(',');
  //       return this.http.get<AnimeDetail[]>(`${this.franchiseBaseUrl}/${franchiseId}/animes?skip=${skipQueryString}`)
  //         .pipe(
  //           map((serverResults) => {
  //             return stateResults.concat(serverResults);
  //           })
  //         );
  //     })
  //   );
  // }

  loadAnimeMediaReactions(animeId: number) {
    this.http.get<GetMediaReactionByAnimeResponseDto[]>(`${this.baseUrl}/${animeId}/media-reactions`)
      .pipe(map(dtos => dtos.map(mapGetMediaReactionByAnimeToMediaReaction)))
      .subscribe((reactions) => {
        this.animeReactionsSubject.next(reactions);
      })
  }
}
