import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, signal} from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UserAnimeService } from '../../../shared/services/user-anime.service';
import { UpdateLibraryEntryRequest } from '../../../shared/contracts/updateLibraryEntryRequest.interface';
import { UsersService } from '../../../shared/services/users.service';
import { progressIsValid } from '../../../shared/validators/validators';
import { ModalTitleComponent } from "../modal-title/modal-title.component";
import { ManageRatingFormComponent } from "../manage-rating-form/manage-rating-form.component";

@Component({
  selector: 'app-library-entry',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgbTooltip, ModalTitleComponent, ManageRatingFormComponent],
  templateUrl: './manage-library-entry-modal.component.html',
  styleUrl: './manage-library-entry-modal.component.css'
})
export class ManageLibraryEntryModalComponent implements OnInit {
  private userAnimeService = inject(UserAnimeService);
  private usersService = inject(UsersService);
  private activeModal = inject(NgbActiveModal);

  updateLibraryEntryForm!: FormGroup;
  addNotAllowedClass = false;
  animeEpisodeCount = 0;

  libraryEntry$ = this.userAnimeService.currentEntry$;
  canEdit$ = this.usersService.canEdit$;
  submitting = false;

  ngOnInit() {
    combineLatest([this.canEdit$, this.libraryEntry$])
      .pipe(take(1))
      .subscribe(([canEdit, libraryEntry]) => {
        if (!libraryEntry) return;
        
        this.updateLibraryEntryForm = new FormGroup({
          libraryEntryId: new FormControl<any>({value: libraryEntry.id}),
          status: new FormControl<any>({ value: libraryEntry.watchStatus, disabled: !canEdit }, [this.statusIsDifferentValidator(libraryEntry.watchStatus)]),
          rating: new FormControl<any>({ value: libraryEntry.userRating, disabled: !canEdit }, [this.ratingIsDifferentValidator(libraryEntry.userRating)]),
          progress: new FormControl<any>({ value: libraryEntry.episodesWatched, disabled: !canEdit }, [this.progressIsDifferentValidator(libraryEntry.episodesWatched)])
        });

        this.addNotAllowedClass = !canEdit;
        this.animeEpisodeCount = libraryEntry.anime.episodeCount ?? 0;
      })
  }

  updateRating(rating: number) {
    this.rating?.patchValue(rating)
  }

  onClose = () => this.activeModal.close();

  onSubmit() {
    if (this.submitting) return;

    this.submitting = true;
    const formData = this.updateLibraryEntryForm.value;

    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: formData.libraryEntryId.value,
      episodesWatched: 0
    }
    
    if (this.progress !== null) {
      if (!progressIsValid(this.progress.value, this.animeEpisodeCount)) {
        //If progress is invalid, reset its value.
        this.progress.patchValue(this.animeEpisodeCount);
        this.submitting = false;
        return;
      }
      req.episodesWatched = this.progress.value
    }
    if (this.status !== null) {
      req.watchStatus = this.status.value
    }
    if (this.rating !== null) {
      req.userRating = this.rating.value
    }

    // Only reset submitting on error; on success the modal is closing and the button must stay disabled.
    this.userAnimeService.updateEntry(req)
      .subscribe({
        next: () => this.activeModal.close(),
        error: () => this.submitting = false
      });
  }

  onDeleteLibraryEntry(animeId: number) {
    this.userAnimeService.deleteEntry(animeId)
      .subscribe({
        next: () => this.activeModal.close()
      });
  }

  //FORM "VALIDATORS"
  statusIsDifferentValidator(status: string | undefined): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.libraryEntry$ !== undefined) {
        if (control.value === status) {
          return null;
        }
      }
      return { statusIsDifferent: true }
    }
  }

  ratingIsDifferentValidator(rating: number | undefined): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      //control values are strings. needs to be converted to number
      let controlVal = control.value === "" || control.value === null ? null : Number(control.value);
      if (this.libraryEntry$ !== undefined) {
        if (controlVal === rating) {
          return null;
        }
      }
      return { ratingIsDifferent: true }
    }
  }

  progressIsDifferentValidator(progress: number): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if (this.libraryEntry$ !== undefined) {
        if (control.value === progress) {
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
