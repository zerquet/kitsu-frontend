import { Component, inject, OnInit, input, DestroyRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CreateLibraryEntryRequest } from '../../../../../../shared/contracts/createLibraryEntryRequest.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../../../../auth/register/register.component';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ManageLibraryEntryModalComponent } from '../../../../../../shared/components/manage-library-entry-modal/manage-library-entry-modal.component';
import { of, switchMap, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddMediaReactionModalComponent } from '../../../../../user/pages/users/components/add-media-reaction-modal/add-media-reaction-modal.component';
import { EditMediaReactionModalComponent } from '../../../../../user/components/edit-media-reaction-modal/edit-media-reaction-modal.component';

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
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  animeId = input.required<number>();
  animeEpisodeCount = input.required<number>();
  libraryEntry$ = this.userAnimeService.currentEntry$;
  isLoggedIn = false;

  updateLibraryEntryForm = new FormGroup({
    libraryEntryId: new FormControl(),
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });

  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];

    this.authService.authenticatedUser$
      .pipe(
        switchMap(authenticatedUser => {
          this.isLoggedIn = !!authenticatedUser;

          if (!authenticatedUser) return of(null);

          return this.userAnimeService.loadCurrentEntry(authenticatedUser.id, animeId);
        }),
        takeUntilDestroyed(this.destroyRef)
      ).subscribe();

    this.userAnimeService.currentEntry$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(libraryEntry => {
        if (libraryEntry === null) return;

        this.updateLibraryEntryForm.patchValue({
          libraryEntryId: libraryEntry.id,
          episodeProgress: libraryEntry.episodesWatched,
          status: libraryEntry.watchStatus,
          rating: libraryEntry.userRating
        });
      });

  }

  //TODO when posting or editing an existing media reaction, you pass a component to the modal service. 
  // the media reaction components still use initializeModalData(), which is outdated and should use the typed modal service, but it'll need a few tweaks.
  // So the calling components need to be updated. Then, post/put actions for media reactions should update the current entry and the libary states in the service. 

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
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (libraryEntry) => {
            this.updateLibraryEntryForm.patchValue({ 
              libraryEntryId: libraryEntry.id,
              episodeProgress: libraryEntry.episodesWatched,
              status: libraryEntry.watchStatus 
            });
          }
        });
    }
  }

  private getEpisodesWatched(watchStatus: string) {
    return watchStatus === 'completed' ? this.animeEpisodeCount() : 0;
  }

  onChangeWatchStatus(watchStatus: string) {
    const formData = this.updateLibraryEntryForm.value;

    const req: UpdateLibraryEntryRequest = {
      libraryEntryId: formData.libraryEntryId,
      episodesWatched: watchStatus === 'completed' ? this.animeEpisodeCount() : formData.episodeProgress,
      userRating: formData.rating,
      watchStatus: watchStatus
    };

    this.userAnimeService.updateEntry(req)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  onPostReaction() {
    this.modalService.open(AddMediaReactionModalComponent);
  }

  onEditReaction() {
    this.modalService.open(EditMediaReactionModalComponent, { backdropClass: 'modal-dark-backdrop'}); //TODO automatically add class to each modal instance.
  }

  onEditLibraryEntry() {
    this.modalService.open(ManageLibraryEntryModalComponent);
  }

  /**FORM GETTERS */
  get libraryEntryId() { return this.updateLibraryEntryForm.get("libraryEntryId")}

  get episodeProgress() { return this.updateLibraryEntryForm.get("episodeProgress"); }

  get rating() { return this.updateLibraryEntryForm.get("rating"); }

  get status() { return this.updateLibraryEntryForm.get("status"); }
}
