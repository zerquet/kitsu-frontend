import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject, Observable, distinctUntilChanged, mergeMap, takeUntil, map, combineLatest, switchMap, of, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Anime } from '../../../shared/models/anime.model';
import { LibraryEntry } from '../../../shared/models/libraryEntry.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../../core/auth/register/register.component';
import { UsersService } from '../../../shared/services/users.service';
import { NavTabsComponent } from '../../../shared/components/nav-tabs/nav-tabs.component';
import { AnimeContainerComponent } from '../../components/anime-container/anime-container.component';
import { CoverPhotoComponent } from "../../../shared/components/cover-photo/cover-photo.component";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'anime',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    NavTabsComponent,
    AnimeContainerComponent,
    CoverPhotoComponent
],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);

  private animeService = inject(AnimeService); //in this component, should not get all animes. create setState methods and call them according to the component
  private route = inject(ActivatedRoute);
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  
  form = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });
  tabs = ['summary', 'episodes', 'characters', 'franchise'];
  environment = environment;
  
  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];
    
    this.usersService.getLibraryEntry(this.authService.currentUser$.getValue()!.id, animeId).subscribe((entry) => {
      this.libraryEntry$.next(entry);
      if(entry === null) return;
      
      this.form.patchValue({"episodeProgress": entry.episodesWatched});
      this.form.patchValue({"status": entry.watchStatus});
      this.form.patchValue({"rating": entry.userRating});
    })

    this.usersService.getFavoriteAnime(animeId).subscribe((fa) => {
      this.isFavorite$.next(fa !== null);
      console.log(this.isFavorite$.getValue());
      
    });
    
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private destroy$ = new Subject<void>();
  libraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null); 
  isFavorite$ = new BehaviorSubject<boolean>(false);

  anime$ = this.route.params.pipe(
    distinctUntilChanged(),
    switchMap(params => this.animeService.getAnime(params['id'])),
    takeUntil(this.destroy$)
  );

  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "summary"),
    takeUntil(this.destroy$)
  );

  createEntry(watchStatus: string, anime: Anime) {
    if(this.authService.currentUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      const episodesCompleted = watchStatus === 'completed' ? anime.details.episodeCount : 0;
      this.usersService.createEntry(anime, watchStatus, episodesCompleted!).subscribe((entryId) => {
        this.form.patchValue({"episodeProgress": episodesCompleted});
        this.form.patchValue({"status": watchStatus});

        //this is local so it's fine if we don't provide animeInfo
        const entry: LibraryEntry = {
          id: entryId,
          watchStatus: watchStatus,
          userRating: null,
          episodesWatched: episodesCompleted!,
          animeInfo: null
        };

        this.libraryEntry$.next(entry);
      })
    }
  }

  onIncrementProgressClick(episodeCount: number) {
    const currentProgress = this.episodeProgress?.value;
    if(currentProgress + 1 <= episodeCount!)
      this.episodeProgress?.patchValue(currentProgress + 1);
  }

  updateEntry(anime: Anime) {
    const entry: LibraryEntry = {
      id: this.libraryEntry$.value!.id,
      watchStatus: this.status?.value,
      userRating: this.rating?.value,
      episodesWatched: this.episodeProgress?.value,
      animeInfo: {
        animeId: anime.id,
        title: anime.title,
        imageUrl: anime.imageUrl,
        episodeCount: anime.details.episodeCount
      }
    }

    this.usersService.updateEntry(entry).subscribe(() => {
      this.form.patchValue({"episodeProgress": entry.episodesWatched});
      this.form.patchValue({"status": entry.watchStatus});
      this.form.patchValue({"rating": entry.userRating});

      this.libraryEntry$.next(entry)
    });
  }

  deleteEntry = (anime: Anime) => {
    this.usersService.deleteEntry(anime.id).subscribe(() => 
      this.libraryEntry$.next(null)
    );
  } 

  addFavorite(anime: Anime) {
    if(this.authService.currentUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.usersService.addFavoriteAnime(anime);
      this.isFavorite$.next(true);
    }
  }

  removeFavorite(animeId: number) {
    this.usersService.deleteFavoriteAnime(animeId);
    this.isFavorite$.next(false);
  }

  /**FORM GETTERS */
  get episodeProgress() { return this.form.get("episodeProgress"); }

  get rating() { return this.form.get("rating"); }

  get status() { return this.form.get("status"); }
}
