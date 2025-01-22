import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject, BehaviorSubject, takeUntil } from 'rxjs';
import { LibraryEntryWithAnimeInfo } from '../../models/libraryEntryWithAnimeInfo.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../../shared/services/users.service';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-library-entry',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe],
  templateUrl: './library-entry.component.html',
  styleUrl: './library-entry.component.css'
})
export class LibraryEntryComponent implements OnDestroy {
  public authService = inject(AuthService);
  
  private usersService = inject(UsersService);
  private activeModal = inject(NgbActiveModal);
  
  private destroy$ = new Subject<void>();
  
  form = new FormGroup({
    status: new FormControl('',[this.statusIsDifferentValidator()]),
    rating: new FormControl(0, [this.ratingIsDifferentValidator()]),
    progress: new FormControl(0, [this.progressIsDifferentValidator()])
  });
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  libraryEntry$ = new BehaviorSubject<LibraryEntryWithAnimeInfo | undefined>(undefined); //itd be nice if this was handled by a service
  userProfile$ = this.usersService.getCurrentUserProfile();
  
  initializeModalData(entry: LibraryEntryWithAnimeInfo) {    
    this.libraryEntry$.next(entry);

    this.form.patchValue({"status": entry.watchStatus});
    this.form.patchValue({"rating": entry.userRating});
    this.form.patchValue({"progress": entry.episodesWatched});
  }

  closeModal = () => this.activeModal.close();

  saveChanges() {
    const entry = this.libraryEntry$.value;
    const data: LibraryEntryWithAnimeInfo = {...entry!, watchStatus: this.status.value, episodesWatched: this.progress.value!, userRating: this.rating.value}
    // const data: LibraryEntryWithAnimeInfo = {
    //   id: entry?.id!,
    //   animeId: entry?.animeId!,
    //   watchStatus: this.status.value,
    //   episodesWatched: this.progress.value!,
    //   userRating: this.rating.value,
    //   title: entry?.title!,
    //   imageUrl: entry?.imageUrl!,
    //   totalEpisodes: entry?.totalEpisodes!
    // }
    this.usersService.updateEntry(data, this.activeModal);
  }

  deleteEntry = () => this.usersService.deleteEntry(this.libraryEntry$.value?.animeId!, this.activeModal);

  //FORM "VALIDATORS"
  statusIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.libraryEntry$ !== undefined) {
        if(control.value === this.libraryEntry$.value?.watchStatus) {
          return null;
        }
      }
      return {statusIsDifferent:true}
    }
  }

  ratingIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      //control values are strings. needs to be converted to number
      let controlVal = control.value === "" || control.value === null ? null : Number(control.value);
      if(this.libraryEntry$ !== undefined) {
        if(controlVal === this.libraryEntry$.value?.userRating) {
          return null;
        }
      }
      return {ratingIsDifferent:true}
    }
  }

  progressIsDifferentValidator(): ValidatorFn {
    //validator creation function
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.libraryEntry$ !== undefined) {
        if(control.value === this.libraryEntry$.value?.episodesWatched) {
          return null;
        }
      }
      return {progressIsDifferent:true}
    }
  }

  //FORM GETTERS
  get status() { return this.form.controls["status"]; }

  get rating() { return this.form.controls["rating"]; }

  get progress() { return this.form.controls["progress"]; }
}
