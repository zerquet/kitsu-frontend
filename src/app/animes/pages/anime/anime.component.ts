import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, BehaviorSubject, Observable, distinctUntilChanged, mergeMap, takeUntil, map, combineLatest, switchMap, of, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Anime } from '../../../shared/models/anime.model';
import { LibraryEntry } from '../../../shared/models/libraryEntry.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AnimeEpisodesComponent } from '../../components/anime-episodes/anime-episodes.component';
import { AnimeFranchiseComponent } from '../../components/anime-franchise/anime-franchise.component';
import { AnimeSummaryComponent } from '../../components/anime-summary/anime-summary.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../../core/auth/register/register.component';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-anime',
  standalone: true,
  imports: [AsyncPipe, CommonModule, ReactiveFormsModule, AnimeSummaryComponent, AnimeEpisodesComponent, AnimeFranchiseComponent],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnInit, OnDestroy {
  public authService = inject(AuthService);

  private animeService = inject(AnimeService); //in this component, should not get all animes. create setState methods and call them according to the component
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  
  private destroy$ = new Subject<void>();

  form = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });

  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];

    this.usersService.getLibraryEntry(this.authService.loggedUserId$.getValue()!, animeId).subscribe((entry) => {
      this.libraryEntry$.next(entry);
      if(entry === null) return;
      
      this.form.patchValue({"episodeProgress": entry.episodesWatched});
      this.form.patchValue({"status": entry.watchStatus});
      this.form.patchValue({"rating": entry.userRating});
    })

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  libraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null); //i need to create and use only one library entry class (animeDetails object as nullable) 

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

  private populateFormFields(res: LibraryEntry | null) {
  }

  createEntry(watchStatus: string, animeId: number, animeEpisodeCount: number) {
    if(this.authService.isLoggedIn$.getValue() === false) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      const episodesCompleted = watchStatus === 'completed' ? animeEpisodeCount : 0;
      this.usersService.createEntry(animeId, watchStatus, episodesCompleted).subscribe((entryId) => {
        this.form.patchValue({"episodeProgress": episodesCompleted});
        this.form.patchValue({"status": watchStatus});

        const entry: LibraryEntry = {
          id: entryId,
          watchStatus: watchStatus,
          userRating: '',
          episodesWatched: episodesCompleted
        };

        this.libraryEntry$.next(entry);
      })
    }
  }

  onIncrementProgressClick(anime: Anime) {
    var currentProgress = this.episodeProgress?.value;
    if(currentProgress + 1 <= anime.details.episodeCount!) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  updateEntry(animeId: number) {
    const data = { //prolly need a dto for this
      id: this.libraryEntry$.value!.id,
      animeId: animeId,
      episodesWatched: this.episodeProgress?.value,
      userRating: this.rating?.value,
      watchStatus: this.status?.value
    }

    this.usersService.updateEntry(data).subscribe((res) => {
      this.form.patchValue({"episodeProgress": data.episodesWatched});
      this.form.patchValue({"status": data.watchStatus});
      this.form.patchValue({"rating": data.userRating});

      const entry: LibraryEntry = {
        id: data.id,
        watchStatus: data.watchStatus,
        userRating: data.userRating,
        episodesWatched: data.episodesWatched
      };

      this.libraryEntry$.next(entry)
    });
  }

  deleteEntry = (anime: Anime) => {
    this.usersService.deleteEntry(anime.id).pipe(takeUntil(this.destroy$)).subscribe(() => this.libraryEntry$.next(null));
  } 

  updateTab = (tab: string, animeId: number) => this.router.navigate([`/anime/${animeId}/${tab}`]);

  /**FORM GETTERS */
  get episodeProgress() { return this.form.get("episodeProgress"); }

  get rating() { return this.form.get("rating"); }

  get status() { return this.form.get("status"); }
}
