import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { UserProfile } from '../models/userProfile.model';
import { LibraryEntry } from '../models/libraryEntry.model';
import { FavoriteAnime } from '../models/favoriteAnime.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/services/auth.service';
import { MediaReaction } from '../models/mediaReaction.model';
import { GetMediaReactionsByUserItemResponse } from '../contracts/getMediaReactionByUserItemResponse.interface';
import { UpdateMediaReactionRequest } from '../contracts/updateMediaReactionRequest.interface';
import { mapGetMediaReactionByUserItemResponseToMediaReaction } from '../mapper';
import { CreateLibraryEntryRequest } from '../contracts/createLibraryEntryRequest.interface';
import { UpdateLibraryEntryRequest } from '../contracts/updateLibraryEntryRequest.interface';
import { GetLibraryEntryResponseDto } from '../../features/anime/dtos/get-library-entry-response.dto';
import { CreateLibraryEntryResponseDto } from '../../features/anime/dtos/create-library-entry-response.dto';
import { UpdateLibraryEntryResponseDto } from '../../features/anime/dtos/update-library-entry-response.dto';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class UserAnimeService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);

  private readonly libraryBaseUrl = `${environment.apiUrl}/library`;
  private readonly favoritesBaseUrl = `${environment.apiUrl}/favorites`;
  private readonly reactionsBaseUrl = `${environment.apiUrl}/mediaReactions`;

  profile$ = this.usersService.profile$;
  favoriteAnimes$ = new BehaviorSubject<FavoriteAnime[]>([]);
  library$ = new BehaviorSubject<LibraryEntry[]>([]);
  mediaReactions$ = new BehaviorSubject<MediaReaction[]>([]);
  toastService: any;


  /*LIBRARY METHODS*/

  //profile is only relevant in the context of library page. here, i get userId from auth service.
  getLibraryEntry(userId: string | null, animeId: number): Observable<GetLibraryEntryResponseDto | null> {
    if (userId === null)
      return of(null);
    else {
      return this.http.get<GetLibraryEntryResponseDto>(`${this.libraryBaseUrl}Entry/${animeId}`)
    }
  }

  setLibraryStateByUserId(userDisplayId: any) {
    //This does not handle users with empty library
    let userId = this.profile$.getValue()?.displayId;
    if (userDisplayId !== null || userDisplayId !== undefined) {
      userId = userDisplayId;
    }
    this.getLibraryByDisplayId(userDisplayId)
      .subscribe((library) => {
        this.library$.next(library);
      });
  }

  //this can be made private
  private getLibraryByDisplayId(userDisplayId: any) {
    return this.http.get<LibraryEntry[]>(`${this.libraryBaseUrl}/${userDisplayId}`);
  }

  createEntry(req: CreateLibraryEntryRequest): Observable<CreateLibraryEntryResponseDto> {
    return this.http.post<CreateLibraryEntryResponseDto>(`${this.libraryBaseUrl}`, req)
      .pipe(
        tap((res) => {
          // const library = this.library$.getValue();
          // library.push(res);
          // this.library$.next(library);
        })
      );
  }

  updateEntry(req: UpdateLibraryEntryRequest): Observable<UpdateLibraryEntryResponseDto> {
    req.userRating = Number(req.userRating) === 0 ? undefined : Number(req.userRating);
    return this.http.put<UpdateLibraryEntryResponseDto>(`${this.libraryBaseUrl}`, req)
      .pipe(
      // tap((res) => {
      //   const library = this.library$.getValue();
      //   library[library.findIndex((e) => e.id == res.id)] = res;
      //   this.library$.next(library);
      // })
    );
  }

  deleteEntry(animeId: number) {
    return this.http.delete<void>(`${this.libraryBaseUrl}/${animeId}`)
      .pipe(
        tap(() => {
          let library = this.library$.getValue();
          library = library.filter((e) => e.anime.id !== animeId);
          this.library$.next(library);
        })
      );
  }

  /* FAVORITES METHODS */

  setFavoriteAnimesState() {
    //By UserId in JWT token claim
    if (this.favoriteAnimes$.getValue().length === 0) {
      this.http.get<FavoriteAnime[]>(`${this.favoritesBaseUrl}`)
        .subscribe((favorites) => {
          this.favoriteAnimes$.next(favorites);
        })
    }
  }

  addFavoriteAnime(animeId: number) {
    return this.http.post<FavoriteAnime>(`${this.favoritesBaseUrl}/${animeId}`, null)
      .pipe(
        tap((res) => {
          const favorites = this.favoriteAnimes$.getValue();
          favorites.push(res);
          this.favoriteAnimes$.next(favorites);
        })
      );
  }

  getFavoriteAnime(animeId: number) {
    return this.http.get<FavoriteAnime>(`${this.favoritesBaseUrl}/${animeId}`);
  }

  updateFavoriteAnimes(favoriteAnimes: FavoriteAnime[]) {
    const animeIds = favoriteAnimes.map(a => a.animeId);
    return this.http.put<void>(`${this.favoritesBaseUrl}/updatebulk`, animeIds)
      .pipe(
        tap(() => {
          this.favoriteAnimes$.next(favoriteAnimes);
        })
      );
  }

  deleteFavoriteAnime(animeId: number) {
    return this.http.delete<void>(`${this.favoritesBaseUrl}/${animeId}`)
      .pipe(
        tap(() => {
          let favorites = this.favoriteAnimes$.getValue();
          favorites = favorites.filter(f => f.animeId !== animeId);
          this.favoriteAnimes$.next(favorites);
        })
      );
  }

  /** MEDIA REACTIONS METHODS */
  addMediaReaction(req: FormData): Observable<MediaReaction> {
    return this.http.post<any>(this.reactionsBaseUrl, req)
      .pipe(
        tap((res) => {
          const mediaReactions = this.mediaReactions$.getValue();
          mediaReactions.push(res);
          this.mediaReactions$.next(mediaReactions);
        })
      );
  }

  updateMediaReaction(req: UpdateMediaReactionRequest): Observable<void> {
    return this.http.put<void>(this.reactionsBaseUrl, req)
      .pipe(
        tap(() => {
          const mediaReactions = this.mediaReactions$.getValue();
          let mediaReactionIndex = mediaReactions.findIndex((e) => e.id == req.reactionId);
          let mediaReactionToUpdate = mediaReactions[mediaReactionIndex];

          mediaReactionToUpdate.reaction = req.reaction;

          mediaReactions[mediaReactionIndex] = mediaReactionToUpdate

          this.mediaReactions$.next(mediaReactions);
        })
      );
  }

  deleteMediaReaction(reactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.reactionsBaseUrl}/${reactionId}`)
      .pipe(
        tap(() => {
          const mediaReactions = this.mediaReactions$.value.filter((x) => x.id !== reactionId);
          this.mediaReactions$.next(mediaReactions);
        })
      );
  }

  setMediaReactionsStateByUserId(routeUserId: any) {
    if (routeUserId !== null || routeUserId !== undefined) {
      this.getMediaReactionsByUserId()
        .subscribe((res) => {
          this.mediaReactions$.next(res);
        });
    }
  }

  //this can be made private
  private getMediaReactionsByUserId() {
    return this.http.get<GetMediaReactionsByUserItemResponse[]>(this.reactionsBaseUrl)
      .pipe(
        map((reactions) => reactions.map(item => mapGetMediaReactionByUserItemResponseToMediaReaction(item)))
      );
  }

  getMediaReactionById(id: number) {
    return this.http.get<GetMediaReactionsByUserItemResponse>(`${this.reactionsBaseUrl}/${id}`)
      .pipe(
        map(reaction => mapGetMediaReactionByUserItemResponseToMediaReaction(reaction))
      );
  }
}
