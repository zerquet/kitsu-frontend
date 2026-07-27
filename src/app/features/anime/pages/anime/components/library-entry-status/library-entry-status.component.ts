import { Component, inject, OnInit, input, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CreateLibraryEntryRequest } from '../../../../../../shared/contracts/createLibraryEntryRequest.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../../../../auth/register/register.component';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ManageLibraryEntryModalComponent } from '../../../../../../shared/components/manage-library-entry-modal/manage-library-entry-modal.component';
import { of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LibraryEntry } from '../../../../../../shared/models/library-entry.model';
import { UsersService } from '../../../../../../shared/services/users.service';

@Component({
  selector: 'library-entry-status',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './library-entry-status.component.html',
  styleUrl: './library-entry-status.component.css'
})
export class LibraryEntryStatusComponent implements OnInit {
  public authService = inject(AuthService);
  private userAnimeService = inject(UserAnimeService);
  private modalService = inject(NgbModal);
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  animeId = input.required<number>();
  animeEpisodeCount = input.required<number>();
  libraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null);
  isLoggedIn = false;

  updateLibraryEntryForm = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });

  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];

    this.authService.authenticatedUser$.pipe(
      switchMap(authenticatedUser => {
        this.isLoggedIn = !!authenticatedUser;

        if (!authenticatedUser) return of(null)

        return this.userAnimeService.getLibraryEntry(authenticatedUser.id, animeId);
      }),
      tap(libraryEntry => {
        if (libraryEntry) this.usersService.setProfile(libraryEntry.userProfile);
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(libraryEntry => {
      this.libraryEntry$.next(libraryEntry);

      if (libraryEntry === null) return;

      this.updateLibraryEntryForm.patchValue({
        episodeProgress: libraryEntry.episodesWatched,
        status: libraryEntry.watchStatus,
        rating: libraryEntry.userRating
      });
    });
  }

  onIncrementProgress(episodeCount: number) {
    const currentProgress = this.episodeProgress?.value;
    if (currentProgress + 1 <= episodeCount) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  onAddToLibrary(watchStatus: string) {
    if (!this.isLoggedIn) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      const episodesWatched = this.getEpisodesWatched(watchStatus);
      const req: CreateLibraryEntryRequest = {
        animeId: this.animeId(),
        watchStatus: watchStatus,
        episodesWatched: episodesWatched
      }

      this.userAnimeService.createEntry(req)
        .subscribe({
          next: (res) => {
            this.updateLibraryEntryForm.patchValue({ "episodeProgress": episodesWatched });
            this.updateLibraryEntryForm.patchValue({ "status": watchStatus });
            this.libraryEntry$.next(res);
          }
        });
    }
  }

  private getEpisodesWatched(watchStatus: string) {
    return watchStatus === 'completed' ? this.animeEpisodeCount() : 0;
  }

  onEditLibraryEntry() {
    const modal = this.modalService.open(ManageLibraryEntryModalComponent);
    modal.componentInstance.initializeModalData(this.libraryEntry$.getValue())
  }

  onSubmit() {
    let cached = this.libraryEntry$.value;
    if (!cached)
      return;

    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: cached.id,
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

    this.userAnimeService.updateEntry(req)
      .subscribe({
        next: (res) => {
          this.updateLibraryEntryForm.patchValue({ "episodeProgress": req.episodesWatched });
          this.updateLibraryEntryForm.patchValue({ "status": req.watchStatus });
          this.updateLibraryEntryForm.patchValue({ "rating": req.userRating });
          this.libraryEntry$.next(res)
        }
      });
  }

  onDeleteLibraryEntry = () => {
    this.userAnimeService.deleteEntry(this.animeId())
      .subscribe({
        next: () => this.libraryEntry$.next(null),
        //if an error happens, we should handles this. If api returns null, user is shown the add to library btns
        // and if they press them again, it could add the same anime twice to their library. add prevention of this
        //in api and handle errors gracefully in frontend. 
      });
  }

  /**FORM GETTERS */
  get episodeProgress() { return this.updateLibraryEntryForm.get("episodeProgress"); }

  get rating() { return this.updateLibraryEntryForm.get("rating"); }

  get status() { return this.updateLibraryEntryForm.get("status"); }
}
