import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, tap } from 'rxjs';
import { LibraryEntry, LibraryEntryDetail, LibraryEntryWithUser } from '../models/library-entry.model';
import { FavoriteAnime } from '../models/favoriteAnime.model';
import { environment } from '../../../environments/environment';
import { MediaReaction, MediaReactionWithUser } from '../models/media-reaction.model';
import { GetMediaReactionByIdResponseDto } from '../../features/user/dtos/get-media-reaction-by-id-response.dto';
import { UpdateMediaReactionRequestDto } from '../contracts/update-media-reaction-request.dto';
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
import { mapGetMediaReactionByUserToMediaReaction, mapGetMediaReactionByIdToMediaReaction, mapAddMediaReactionToMediaReaction, mapUpdateMediaReactionToMediaReaction } from '../mappers/media-reaction.mapper';
import { UpdateMediaReactionResponseDto } from '../../features/user/dtos/update-media-reaction-response.dto';
import { AddMediaReactionRequestDto } from '../contracts/add-media-reaction-request.dto';

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
  private _currentMediaReactionSubject = new BehaviorSubject<MediaReaction | null>(null);
  currentMediaReaction$ = this._currentMediaReactionSubject.asObservable();
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
        filter(dto => !!dto.libraryEntryId), //only proceed if library entry exists. otherwise just set profile.
        map(mapGetLibraryEntryToLibraryEntry),
        tap(libraryEntry => {
          this._currentEntrySubject.next(libraryEntry);
          this._currentMediaReactionSubject.next(libraryEntry.mediaReaction ?? null);
        })
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
    this.updateLibrary(libraryEntry);

    const currentEntry = this._currentEntrySubject.getValue();
    if (currentEntry?.id === libraryEntry.id) {
      this._currentEntrySubject.next(libraryEntry);
    }
  }

  private updateLibrary(libraryEntry: LibraryEntryDetail) {    
    const library = this.library$.getValue();
    const idx = library.findIndex((e) => e.id === libraryEntry.id);

    if (idx !== -1) {
      library[idx] = libraryEntry;
      this.library$.next([...library]);
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
  loadCurrentMediaReaction(mediaReactionId: number): Observable<MediaReactionWithUser> {
    return this.http.get<GetMediaReactionByIdResponseDto>(`${this.mediaReactionsBaseUrl}/${mediaReactionId}`)
      .pipe(
        map(mapGetMediaReactionByIdToMediaReaction),
        tap(mediaReaction => this._currentMediaReactionSubject.next(mediaReaction))//TODO. Set profile from DTO, then map to MediaReaction? (look at loadProfile). Then no need for -WithUser
      );
  }

  changeCurrentMediaReaction(mediaReaction: MediaReaction) {
    this._currentMediaReactionSubject.next(mediaReaction);
  }

  addMediaReaction(req: AddMediaReactionRequestDto): Observable<MediaReaction> { //TODO use simpler DTO instead of unnecessary FormData
    return this.http.post<AddMediaReactionResponseDto>(this.mediaReactionsBaseUrl, req)
      .pipe(
        map(mapAddMediaReactionToMediaReaction),
        tap(mediaReaction => this.addMediaReactionApplyUpdates(mediaReaction))
      );
  }

  private addMediaReactionApplyUpdates(mediaReaction: MediaReaction) {
    //1. update current library entry
    const updatedLibraryEntry = this.updateCurrentEntryMediaReaction(mediaReaction);

    if (!updatedLibraryEntry) return;

    //2. add new reaction to media reactions state
    this.mediaReactions$.next([...this.mediaReactions$.getValue(), mediaReaction]);

    //3. update user library state
    this.updateLibrary(updatedLibraryEntry);

    //4. update current media reaction
    this._currentMediaReactionSubject.next(mediaReaction);
  }

  private updateCurrentEntryMediaReaction(mediaReaction?: MediaReaction) {
    
    const currentEntry = this._currentEntrySubject.value;
    if (!currentEntry) return;

    const updatedLibraryEntry: LibraryEntryDetail = {
      ...currentEntry, 
      mediaReaction: mediaReaction
    }

    this._currentEntrySubject.next(updatedLibraryEntry);

    return updatedLibraryEntry;
  }

  updateMediaReaction(req: UpdateMediaReactionRequestDto): Observable<MediaReaction> {
    return this.http.put<UpdateMediaReactionResponseDto>(this.mediaReactionsBaseUrl, req)
      .pipe(
        map(mapUpdateMediaReactionToMediaReaction),
        tap(mediaReaction => this.updateMediaReactionApplyUpdates(mediaReaction))
    );
  }

  private updateMediaReactionApplyUpdates(mediaReaction: MediaReaction) {     
    //1. update current media reaction
    this._currentMediaReactionSubject.next(mediaReaction);
    
    //2. update media reactions state with updated media reaction
    const mediaReactions = this.mediaReactions$.getValue();
    const idx = mediaReactions.findIndex((e) => e.id === mediaReaction.id);

    if (idx !== -1) {
      mediaReactions[idx] = mediaReaction;
      this.mediaReactions$.next([...mediaReactions]);
    }

    //3. update current library entry
    const updatedLibraryEntry = this.updateCurrentEntryMediaReaction(mediaReaction);
    if (!updatedLibraryEntry) return;

    //4. update user library state
    this.updateLibrary(updatedLibraryEntry);
  }

  deleteMediaReaction(mediaReactionId: number): Observable<void> {
    return this.http.delete<void>(`${this.mediaReactionsBaseUrl}/${mediaReactionId}`)
      .pipe(
        tap(() => this.deleteMediaReactionApplyUpdates(mediaReactionId))
      );
  }

  private deleteMediaReactionApplyUpdates(mediaReactionId: number) {
    //1. remove media reaction from media reactions state
    this.mediaReactions$.next(
      this.mediaReactions$.getValue().filter((m) => m.id !== mediaReactionId)
    );

    //2. update current library entry
    const updatedLibraryEntry = this.updateCurrentEntryMediaReaction(undefined);
    if (!updatedLibraryEntry) return;

    //3. update user library state
    this.updateLibrary(updatedLibraryEntry);

    //4. update current media reaction
    this._currentMediaReactionSubject.next(null);
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
}
