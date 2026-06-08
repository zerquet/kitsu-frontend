import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, distinctUntilChanged, takeUntil, map, switchMap } from 'rxjs';
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
import { CreateLibraryEntryRequest } from '../../../shared/contracts/createLibraryEntryRequest.interface';
import { UpdateLibraryEntryRequest } from '../../../shared/contracts/updateLibraryEntryRequest.interface';
import { GetLibraryEntryResponseDto } from '../../dtos/get-library-entry-response.dto';

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

  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService); //in this component, should not get all animes. create setState methods and call them according to the component
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);

  updateLibraryEntryForm = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });
  tabs = ['summary', 'episodes', 'characters', 'franchise'];
  environment = environment;

  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];

    if (this.authService.authenticatedUser$.getValue() !== null) {
      this.usersService.getLibraryEntry(this.authService.authenticatedUser$.getValue()!.id, animeId)
        .subscribe({
          next: (entry) => {
            this.libraryEntry$.next(entry);
            if (entry === null) return;

            this.updateLibraryEntryForm.patchValue({ "episodeProgress": entry.episodesWatched });
            this.updateLibraryEntryForm.patchValue({ "status": entry.watchStatus });
            this.updateLibraryEntryForm.patchValue({ "rating": entry.userRating });
          }
        });

      this.usersService.getFavoriteAnime(animeId)
        .subscribe({
          next: (res) => this.isFavorite$.next(res !== null)
        });
    }

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  libraryEntry$ = new BehaviorSubject<GetLibraryEntryResponseDto | null>(null);
  isFavorite$ = new BehaviorSubject<boolean>(false);

  anime$ = this.route.params.pipe(
    distinctUntilChanged(),
    switchMap(params => this.animeService.getAnimeById(params['id'])),
    takeUntil(this.destroy$)
  );

  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "summary"),
    takeUntil(this.destroy$)
  );

  onAddToLibraryClick(libraryName: string, anime: Anime) {
    if (this.authService.authenticatedUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      const episodesCompleted = libraryName === 'completed' ? anime.episodeCount : 0;
      let req: CreateLibraryEntryRequest = {
        animeId: anime.id,
        watchStatus: libraryName,
        episodesWatched: episodesCompleted!
      }

      this.usersService.createEntry(req)
        .subscribe({
          next: (res) => {
            this.updateLibraryEntryForm.patchValue({ "episodeProgress": episodesCompleted });
            this.updateLibraryEntryForm.patchValue({ "status": libraryName });
            this.libraryEntry$.next(res);
            //above line is somehow both CreateLibraryEntryResponseDto and GetLibraryEntryResponseDto
            //maybe because they have the same properties? Since this state tracks the status block on the page. 
            //Merge the two dtos to one like UserAnimeStatusBlock? Or map the response Dtos to this new one and set
            //libraryEntry$'s type to UserAnimeStatusBlock?
            //same deal for the onUpdateLibraryEntryFormSubmit method below. 
            //even more reason to move this "User Anime Status Block" to its own component. 
          }
        });
    }
  }

  onIncrementProgressClick(episodeCount: number) {
    const currentProgress = this.episodeProgress?.value;
    if (currentProgress + 1 <= episodeCount) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  onUpdateLibraryEntryFormSubmit() {
    let cached = this.libraryEntry$.value;
    if (!cached)
      return;

    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: cached.libraryEntryId,
      episodesWatched: 0,
    }

    if (this.episodeProgress) {
      req.episodesWatched = this.episodeProgress.value
    }
    if (this.status) {
      req.watchStatus = this.status.value
    }
    if (this.rating) {
      req.userRating = this.rating.value
    }

    this.usersService.updateEntry(req)
      .subscribe({
        next: (res) => {
          this.updateLibraryEntryForm.patchValue({ "episodeProgress": req.episodesWatched });
          this.updateLibraryEntryForm.patchValue({ "status": req.watchStatus });
          this.updateLibraryEntryForm.patchValue({ "rating": req.userRating });
          this.libraryEntry$.next(res)
        }
      });
  }

  onDeleteEntryBtnClick = (anime: Anime) => {
    this.usersService.deleteEntry(anime.id)
      .subscribe({
        next: () => this.libraryEntry$.next(null),
        //if an error happens, we should handles this. If api returns null, user is shown the add to library btns
        // and if they press them again, it could add the same anime twice to their library. add prevention of this
        //in api and handle errors gracefully in frontend. 
      });
  }

  onAddToFavoritesClick(anime: Anime) {
    if (this.authService.authenticatedUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.usersService.addFavoriteAnime(anime.id)
        .subscribe({
          next: () => this.isFavorite$.next(true)
        });
    }
  }

  onUnfavoriteClick(animeId: number) {
    this.usersService.deleteFavoriteAnime(animeId)
      .subscribe({
        next: () => this.isFavorite$.next(false)
      });
  }

  /**FORM GETTERS */
  get episodeProgress() { return this.updateLibraryEntryForm.get("episodeProgress"); }

  get rating() { return this.updateLibraryEntryForm.get("rating"); }

  get status() { return this.updateLibraryEntryForm.get("status"); }
}
