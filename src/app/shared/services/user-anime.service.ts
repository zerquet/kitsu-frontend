import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { LibraryEntry, LibraryEntryDetail, LibraryEntryWithUser } from '../models/library-entry.model';
import { FavoriteAnime } from '../models/favoriteAnime.model';
import { environment } from '../../../environments/environment';
import { MediaReaction, MediaReactionWithUser } from '../models/mediaReaction.model';
import { GetMediaReactionByIdResponseDto } from '../../features/user/dtos/get-media-reaction-by-id-response.dto';
import { UpdateMediaReactionRequest } from '../contracts/updateMediaReactionRequest.interface';
import { CreateLibraryEntryRequest } from '../contracts/createLibraryEntryRequest.interface';
import { UpdateLibraryEntryRequest } from '../contracts/updateLibraryEntryRequest.interface';
import { GetLibraryEntryResponseDto } from '../../features/anime/dtos/get-library-entry-response.dto';
import { CreateLibraryEntryResponseDto } from '../../features/anime/dtos/create-library-entry-response.dto';
import { UpdateLibraryEntryResponseDto } from '../../features/anime/dtos/update-library-entry-response.dto';
import { UsersService } from './users.service';
import { GetMediaReactionByUserResponseDto } from '../../features/user/dtos/get-media-reaction-by-user-response.dto';
import { AddMediaReactionResponseDto } from '../../features/user/dtos/add-media-reaction-response.dto';
import { GetLibraryResponseDto } from '../../features/user/dtos/get-library-response.dto';
import { mapCreateLibraryEntryToLibraryEntry, mapGetLibraryEntryToLibraryEntry, mapGetLibraryToLibraryEntry, mapUpdateLibraryEntryToLibraryEntry } from '../mappers/library-entry.mapper';
import { mapGetMediaReactionByUserToMediaReaction, mapGetMediaReactionByIdToMediaReaction, mapAddMediaReactionToMediaReaction } from '../mappers/media-reaction.mapper';

@Injectable({
  providedIn: 'root'
})
export class UserAnimeService {
  private http = inject(HttpClient);
  private usersService = inject(UsersService);

  private readonly baseUrl = `${environment.apiUrl}`
  private readonly libraryBaseUrl = `${environment.apiUrl}/library`;
  private readonly favoritesBaseUrl = `${environment.apiUrl}/favorites`;
  private readonly mediaReactionsBaseUrl = `${environment.apiUrl}/mediaReactions`;

  profile$ = this.usersService.profile$;
  favoriteAnimes$ = new BehaviorSubject<FavoriteAnime[]>([]);
  library$ = new BehaviorSubject<LibraryEntryDetail[]>([]);
  mediaReactions$ = new BehaviorSubject<MediaReaction[]>([]);
  toastService: any;
  private _currentEntrySubject = new BehaviorSubject<LibraryEntryDetail | null>(null);
  currentEntry$ = this._currentEntrySubject.asObservable();
  private loadedFavorites = false;
  /*LIBRARY METHODS*/

  //profile is only relevant in the context of library page. here, i get userId from auth service.
  loadCurrentEntry(userId: string | null, animeId: number): Observable<LibraryEntryDetail | null> {
    if (userId === null) {
      this._currentEntrySubject.next(null);
      return of(null);
    }
    
    return this.http.get<GetLibraryEntryResponseDto>(`${this.libraryBaseUrl}Entry/${animeId}`)
      .pipe(
        tap(dto => this.usersService.setProfile(dto.userProfile)),
        map(mapGetLibraryEntryToLibraryEntry),
        tap(libraryEntry => this._currentEntrySubject.next(libraryEntry))
      );
  }

  changeCurrentEntry(libraryEntry: LibraryEntryDetail) {
    this._currentEntrySubject.next(libraryEntry);
  }

  loadUserLibrary(userDisplayId: string) {
    //This does not handle users with empty library
    this.http.get<GetLibraryResponseDto[]>(`${this.libraryBaseUrl}/${userDisplayId}`)
      .pipe(map(libraryEntries => {
        return libraryEntries.map(mapGetLibraryToLibraryEntry)
      }))
      .subscribe((library) => {
        this.library$.next(library);
      });
  }

  createEntry(req: CreateLibraryEntryRequest): Observable<LibraryEntry> {
    return this.http.post<CreateLibraryEntryResponseDto>(`${this.libraryBaseUrl}`, req)
      .pipe(
        map(mapCreateLibraryEntryToLibraryEntry),
        tap((libraryEntry) => {
          this.library$.next([...this.library$.getValue(), libraryEntry]);
          this._currentEntrySubject.next(libraryEntry)
        })
      );
  }

  updateEntry(req: UpdateLibraryEntryRequest): Observable<LibraryEntry> {
    req.userRating = Number(req.userRating) === 0 ? undefined : Number(req.userRating); //what do 0 and NULL/undefined represent? 
    return this.http.put<UpdateLibraryEntryResponseDto>(`${this.libraryBaseUrl}`, req)
      .pipe(
        map(mapUpdateLibraryEntryToLibraryEntry),
        tap(libraryEntry => this.applyUpdate(libraryEntry))
    );
  }

  private applyUpdate(libraryEntry: LibraryEntryDetail) {
    const library = this.library$.getValue();
    const idx = library.findIndex((e) => e.id === libraryEntry.id)

    if (idx !== -1) {
      library[idx] = libraryEntry;
      this.library$.next([...library]);
    }

    const currentEntry = this._currentEntrySubject.getValue();
    if (currentEntry?.id === libraryEntry.id) {
      this._currentEntrySubject.next(libraryEntry);
    }
  }

  deleteEntry(animeId: number) {
    return this.http.delete<void>(`${this.libraryBaseUrl}/${animeId}`)
      .pipe(
        tap(() => this.applyDeletion(animeId))
      );
  }

  private applyDeletion(animeId: number) {
    this.library$.next(
      this.library$.getValue().filter((e) => e.animeId !== animeId)
    );

    const currentEntry = this._currentEntrySubject.getValue();
    if (currentEntry?.animeId === animeId) {
      this._currentEntrySubject.next(null);
    }
  }

  /* FAVORITES METHODS */

  loadFavoriteAnime(userDisplayId: string) {    
    if (this.loadedFavorites) return;
        
    this.http.get<FavoriteAnime[]>(`${this.baseUrl}/${userDisplayId}/favorites`)
      .subscribe((favorites) => {
        this.favoriteAnimes$.next(favorites);
        this.loadedFavorites = true;
      })
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
    return this.http.post<AddMediaReactionResponseDto>(this.mediaReactionsBaseUrl, req)
      .pipe(
        map(mapAddMediaReactionToMediaReaction)
        // tap((res) => {
        //   const mediaReactions = this.mediaReactions$.getValue();
        //   mediaReactions.push(res);
        //   this.mediaReactions$.next(mediaReactions);
        // })
      );
  }

  updateMediaReaction(req: UpdateMediaReactionRequest): Observable<void> {
    return this.http.put<void>(this.mediaReactionsBaseUrl, req)
      .pipe(
      // tap(() => {
      //   const mediaReactions = this.mediaReactions$.getValue();
      //   let mediaReactionIndex = mediaReactions.findIndex((e) => e.id == req.reactionId);
      //   let mediaReactionToUpdate = mediaReactions[mediaReactionIndex];

      //   mediaReactionToUpdate.reaction = req.reaction;

      //   mediaReactions[mediaReactionIndex] = mediaReactionToUpdate

      //   this.mediaReactions$.next(mediaReactions);
      // })
    );
  }

  deleteMediaReaction(mediaReactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.mediaReactionsBaseUrl}/${mediaReactionId}`)
      .pipe(
        tap(() => {
          const mediaReactions = this.mediaReactions$.value.filter((x) => x.id !== mediaReactionId);
          this.mediaReactions$.next(mediaReactions);
        })
      );
  }

  loadUserMediaReactions(userDisplayId: string) {
    this.http.get<GetMediaReactionByUserResponseDto[]>(`${this.baseUrl}/${userDisplayId}/mediaReactions`)
      .pipe(
        map((dtos) => dtos.map(dto => mapGetMediaReactionByUserToMediaReaction(dto)))
      )
      .subscribe((mediaReactions) => {
        this.mediaReactions$.next(mediaReactions);
      });

  }

  getMediaReactionById(mediaReactionId: number): Observable<MediaReactionWithUser> {
    return this.http.get<GetMediaReactionByIdResponseDto>(`${this.mediaReactionsBaseUrl}/${mediaReactionId}`)
      .pipe(map(mapGetMediaReactionByIdToMediaReaction));
  }
}
