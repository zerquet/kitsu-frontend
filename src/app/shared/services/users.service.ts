import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { UserProfile } from '../models/userProfile.model';
import { LibraryEntryWithAnimeInfo } from '../../users/models/libraryEntryWithAnimeInfo.model';
import { LibraryEntry } from '../models/libraryEntry.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7017/api/users';
  private readonly libraryBaseUrl = "https://localhost:7017/api/library";
  private _currentUserProfile$ = new BehaviorSubject<UserProfile | null>(null);
  currentLibraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null); 
  //get from state, create via api then update state, delete from api then from state, etc. etc. 
  //currLibraryEntry represents the entry for an anime when the user is viewing the anime page.

  library$ = new BehaviorSubject<LibraryEntryWithAnimeInfo[]>([]);

  getUserProfileById(id: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${id}`);
  }

  getCurrentUserProfile(): Observable<UserProfile | null> {
    return this._currentUserProfile$;
  }

  updateUserProfile(data: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.baseUrl}`, data);
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

  setLibraryState() {
    if(this.library$.getValue().length === 0) //This does not handle users with empty library
      this.getLibrary();
  }

  getLibrary() {
    const userId = this._currentUserProfile$.getValue()?.id;

    this.http.get<LibraryEntryWithAnimeInfo[]>(`${this.libraryBaseUrl}/${userId}`).subscribe((library) => {
      this.library$.next(library);
    })
  }

  createEntry(animeId: number, status: string, episodesWatched: number): Observable<number> {
    return this.http.post<number>(`${this.libraryBaseUrl}`, 
      {
        AnimeId: animeId,
        WatchStatus: status,
        EpisodesWatched: episodesWatched
      });
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

  updateEntry(entry: any, activeModal?: NgbActiveModal): Observable<void> { //would like for entry to not be any, but many types of entrys are used (anime, library, library-entry)
    
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
    return this.http.delete<LibraryEntry>(`${this.libraryBaseUrl}/${animeId}`).subscribe((res) => {
      const library = this.library$.value.filter((e) => e.animeId !== animeId);
      
      this.library$.next(library);

      if(activeModal)
        activeModal.close();
    });
  }
}
