import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../../../environments/environment';
import { AppToastService } from '../../../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { filter, switchMap, tap } from 'rxjs';
import { LibraryEntryDetail } from '../../../../../../shared/models/library-entry.model';
import { AddMediaReactionRequestDto } from '../../../../../../shared/contracts/add-media-reaction-request.dto';

@Component({
  selector: 'add-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './add-media-reaction-modal.component.html',
  styleUrl: './add-media-reaction-modal.component.css'
})
export class AddMediaReactionModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private toastService = inject(AppToastService);
  private userAnimeService = inject(UserAnimeService);
  private destroyRef = inject(DestroyRef);
  public environment = environment;

  libraryEntry$ = this.userAnimeService.currentEntry$;
  addMediaReactionForm!: FormGroup;

  charsLeft = 140;

  ngOnInit() {
    //When adding media reaction, implied entry.reaction is null. So this.mediaReaction$ is null, can't use it to create form. 
    //this.mediaReaction$ extends this.currentEntry$, so use this.currentEntry instead? (potentially meaning this.mediaReaction$ can then be used in edit component) 
    this.libraryEntry$
      .pipe(
        filter((libraryEntry): libraryEntry is LibraryEntryDetail => !!libraryEntry), //drop undefined/false entries from stream. filter = true = continue. "is" type guard removes null checking
        tap(libraryEntry => {
          this.addMediaReactionForm = new FormGroup({
            reaction: new FormControl(''),
            animeId: new FormControl(libraryEntry.animeId),
            libraryEntryId: new FormControl(libraryEntry.id)
          });
          console.log(libraryEntry);
          
        }),
        switchMap(() => this.addMediaReactionForm.controls['reaction'].valueChanges),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(term => {
        this.charsLeft = term?.length ? 140 - term.length : 140;
      });
  }

  onSubmit() {
    let req: AddMediaReactionRequestDto = {
      animeId: 0,
      libraryEntryId: 0,
      reaction: ""
    }

    if (this.animeId !== null) {
      req.animeId = this.animeId.value;
    }
    if (this.libraryEntryId !== null) {
      req.libraryEntryId = this.libraryEntryId.value;
    }
    if (this.reaction !== null && this.reaction.value !== null) {
      req.reaction = this.reaction.value;
    }

    this.userAnimeService.addMediaReaction(req)
      .subscribe({
        next: () => {
          this.activeModal.close();
          this.toastService.show('Success', 'Reaction added!')
        },
        error: (err) => {
          this.toastService.show('Error', err)
        }
      })
  }

  get animeId() { return this.addMediaReactionForm.get('animeId') }
  get libraryEntryId() { return this.addMediaReactionForm.get('libraryEntryId') }
  get reaction() { return this.addMediaReactionForm.get('reaction') }
}
