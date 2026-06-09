import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { LibraryEntry } from '../../../../../../shared/models/libraryEntry.model';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';

@Component({
  selector: 'app-library-entry',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './manage-library-entry-modal.component.html',
  styleUrl: './manage-library-entry-modal.component.css'
})
export class ManageLibraryEntryModalComponent implements OnDestroy {
  public authService = inject(AuthService);

  private usersService = inject(UserAnimeService);
  private activeModal = inject(NgbActiveModal);

  updateLibraryEntryForm = new FormGroup({
    status: new FormControl<any>('', [this.statusIsDifferentValidator()]),
    rating: new FormControl<any>(0, [this.ratingIsDifferentValidator()]),
    progress: new FormControl<any>(0, [this.progressIsDifferentValidator()])
  });

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  libraryEntry$ = new BehaviorSubject<LibraryEntry | null>(null);
  userProfile$ = this.usersService.profile$;

  initializeModalData(entry: LibraryEntry) {
    this.libraryEntry$.next(entry);

    this.updateLibraryEntryForm.patchValue({ "status": entry.watchStatus });
    this.updateLibraryEntryForm.patchValue({ "rating": entry.userRating });
    this.updateLibraryEntryForm.patchValue({ "progress": entry.episodesWatched });
  }

  onCloseClick = () => this.activeModal.close();

  onUpdateLibraryEntryFormSubmit() {
    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: 0,
      episodesWatched: 0
    }

    if (this.libraryEntry$.value !== null) {
      req.libraryEntryId = this.libraryEntry$.value.id
    }
    if (this.progress !== null) {
      req.episodesWatched = this.progress.value
    }
    if (this.status !== null) {
      req.watchStatus = this.status.value
    }
    if (this.rating !== null) {
      req.userRating = this.rating.value
    }

    this.usersService.updateEntry(req)
      .subscribe({
        next: () => this.activeModal.close()
      });
  }

  onDeleteEntryBtnClick() {
    this.usersService.deleteEntry(this.libraryEntry$.value?.animeId!)
      .subscribe({
        next: () => this.activeModal.close()
      });
  }

  //FORM "VALIDATORS"
  statusIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.libraryEntry$ !== undefined) {
        console.log(control.value + " and " + this.libraryEntry$.value?.watchStatus);
        if (control.value === this.libraryEntry$.value?.watchStatus) {
          return null;
        }
      }
      return { statusIsDifferent: true }
    }
  }

  ratingIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      //control values are strings. needs to be converted to number
      let controlVal = control.value === "" || control.value === null ? null : Number(control.value);
      if (this.libraryEntry$ !== undefined) {
        if (controlVal === this.libraryEntry$.value?.userRating) {
          return null;
        }
      }
      return { ratingIsDifferent: true }
    }
  }

  progressIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.libraryEntry$ !== undefined) {
        if (control.value === this.libraryEntry$.value?.episodesWatched) {
          return null;
        }
      }
      return { progressIsDifferent: true }
    }
  }

  //FORM GETTERS
  get status() { return this.updateLibraryEntryForm.get("status") }

  get rating() { return this.updateLibraryEntryForm.get("rating") }

  get progress() { return this.updateLibraryEntryForm.get("progress") }
}
