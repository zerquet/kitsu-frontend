import { HttpClient } from '@angular/common/http';
import { inject, Injectable, numberAttribute } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { UserProfile } from '../models/userProfile.model';
import { LibraryEntry } from '../models/libraryEntry.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Anime } from '../models/anime.model';
import { FavoriteAnime } from '../models/favoriteAnime.model';
import { AppToastService } from './app-toast.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private toastService = inject(AppToastService);
  private readonly baseUrl = `${environment.apiUrl}/users`;
  private readonly libraryBaseUrl = `${environment.apiUrl}/library`;
  private readonly favoritesBaseUrl = `${environment.apiUrl}/favorites`;
  private _currentUserProfile$ = new BehaviorSubject<UserProfile | null>(null);
  currentLibraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null); 
  //get from state, create via api then update state, delete from api then from state, etc. etc. 
  //currLibraryEntry represents the entry for an anime when the user is viewing the anime page.
  private _favoriteAnimes$ = new BehaviorSubject<Anime[]>([]);

  library$ = new BehaviorSubject<LibraryEntry[]>([]);

  getUserProfileById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${id}`);
  }

  getCurrentUserProfile(): Observable<UserProfile | null> {
    return this._currentUserProfile$;
  }

  updateUserProfile(data: FormData, activeModal?: NgbActiveModal) {
    this.http.put<{profileId: string, coverId: string}>(`${this.baseUrl}`, data).subscribe({
      next: (res) => {
        const profileUpdates: UserProfile = {
          id: data.get('id')!.toString(),
          username: data.get('username')!.toString(),
          location: data.get('location')!.toString(),
          bio: data.get('bio')!.toString(),
          birthday: data.get('birthday') !== null ? data.get('birthday') as unknown as Date : null,
          gender: data.get('gender')!.toString(),
          profilePhotoId: res.profileId,
          coverPhotoId: res.coverId
        }
        this._currentUserProfile$.next(profileUpdates);

        this.toastService.show("Success", "Profile successfully updated!");
        if(activeModal)
          activeModal.close();
      },
      error: (err) => {
        console.log(err);
        
        this.toastService.show("Error", "Updates could not be saved.");
      }
    });
  }

  setUserProfileState(userProfile: UserProfile) {
    this._currentUserProfile$.next(userProfile);
  }

  /*LIBRARY METHODS*/
  
  //profile is only relevant in the context of library page. here, i get userId from auth service.
  getLibraryEntry(userId: string | null, animeId: number): Observable<LibraryEntry | null> { 
    if(userId === null)
      return of(null);
    else {
      return this.http.get<LibraryEntry>(`${this.libraryBaseUrl}Entry/${animeId}`)
    }
  }

  setLibraryState(userId: any) {
    if(this.library$.getValue().length === 0) //This does not handle users with empty library
      this.getLibrary(userId);
  }

  getLibrary(routeUserId: any) {
    let userId = this._currentUserProfile$.getValue()?.id;

    if(routeUserId !== null || routeUserId !== undefined) {
      userId = routeUserId;
    }

    this.http.get<LibraryEntry[]>(`${this.libraryBaseUrl}/${userId}`).subscribe((library) => {
      this.library$.next(library);
    })
  }

  createEntry(anime: Anime, status: string, episodesWatched: number): Observable<number> {
    return this.http.post<number>(`${this.libraryBaseUrl}`, 
      {
        AnimeId: anime.id,
        WatchStatus: status,
        EpisodesWatched: episodesWatched
      }).pipe(
        tap((res) => {
          const entry: LibraryEntry = {
            id: res,
            watchStatus: status,
            userRating: null,
            episodesWatched: episodesWatched,
            animeInfo: {
              animeId: anime.id,
              title: anime.title,
              imageUrl: anime.imageUrl,
              episodeCount: anime.details.episodeCount
            }
          }

          const library = this.library$.getValue();
          library.push(entry);

          this.library$.next(library);
        })
      )
  }

  updateEntryRating(entryId: number, rating: string) {
    let entry = this.library$.getValue().find((e) => e.id == entryId);
    
    if(entry !== undefined) {
      entry.userRating = Number(rating);
      this.updateEntry(entry).subscribe();
    }
  }

  updateEntryProgress(entryId: number, progress: number) {
    let entry = this.library$.getValue().find((e) => e.id == entryId);
    
    if(entry !== undefined) {
      entry.episodesWatched = progress;
      this.updateEntry(entry).subscribe();
    }
  }

  updateEntry(entry: LibraryEntry, activeModal?: NgbActiveModal): Observable<void> {
    entry.userRating = Number(entry.userRating) === 0 ? null : Number(entry.userRating);
    
    return this.http.put<void>(`${this.libraryBaseUrl}`, entry).pipe(
      tap((res) => {
        const library = this.library$.getValue();
        library[library.findIndex((e) => e.id == entry.id)] = entry;
  
        this.library$.next(library);
  
        if(activeModal)
          activeModal.close();
      })
    );
  }

  deleteEntry(animeId: number, activeModal?: NgbActiveModal) {
    return this.http.delete<void>(`${this.libraryBaseUrl}/${animeId}`).pipe(
      tap((res) => {
        const library = this.library$.value.filter((e) => e.animeInfo!.animeId !== animeId);
      
        this.library$.next(library);
  
        if(activeModal)
          activeModal.close();
      })
    );
  }

  /* FAVORITES METHODS */

  setFavoriteAnimesState() {
    if(this._favoriteAnimes$.getValue().length === 0) {
      this.http.get<Anime[]>(`${this.favoritesBaseUrl}`).subscribe((favorites) => {
        this._favoriteAnimes$.next(favorites);
      })
    }
  }

  addFavoriteAnime(anime: Anime) {
    this.http.post<void>(`${this.favoritesBaseUrl}/${anime.id}`, null).subscribe(() => {
      const favorites = this._favoriteAnimes$.getValue();
      favorites.push(anime);
      this._favoriteAnimes$.next(favorites);
    });
  }

  getFavoriteAnimes(): Observable<Anime[]> {
    return this._favoriteAnimes$;
  }

  getFavoriteAnime(animeId: number) {
    return this.http.get<FavoriteAnime>(`${this.favoritesBaseUrl}/${animeId}`);
  }

  updateFavoriteAnimes(animes: Anime[]) {
    const favorites = animes.map(a => a.id);
    this.http.put<void>(`${this.favoritesBaseUrl}/updatebulk`, favorites).subscribe(() => {
      this._favoriteAnimes$.next(animes);
    });
  }

  deleteFavoriteAnime(animeId: number) {
    this.http.delete<void>(`${this.favoritesBaseUrl}/${animeId}`).subscribe(() => {
      let favorites = this._favoriteAnimes$.getValue();
      favorites = favorites.filter(f => f.id !== animeId);
      this._favoriteAnimes$.next(favorites);
    })
  }

}
