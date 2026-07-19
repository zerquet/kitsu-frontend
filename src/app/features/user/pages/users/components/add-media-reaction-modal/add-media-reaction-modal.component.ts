import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntry } from '../../../../../../shared/models/libraryEntry.model';
import { environment } from '../../../../../../../environments/environment';
import { AppToastService } from '../../../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';

@Component({
  selector: 'add-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-media-reaction-modal.component.html',
  styleUrl: './add-media-reaction-modal.component.css'
})
export class AddMediaReactionModalComponent implements OnInit {
  public activeModal = inject(NgbActiveModal);
  public animeMetadata: LibraryEntry | null = null;
  public environment = environment;
  public toastService = inject(AppToastService);
  public usersService = inject(UserAnimeService);

  addMediaReactionForm = new FormGroup({
    reaction: new FormControl(''),
    animeId: new FormControl(),
    libraryEntryId: new FormControl()
  });

  charsLeft = 140;

  ngOnInit(): void {
    this.addMediaReactionForm.controls['reaction'].valueChanges.pipe(

    ).subscribe((term) => {
      if (!term) {
        this.charsLeft = 140;
      }
      else if (term.length === 0) {
        this.charsLeft = 140;
      }
      else {
        this.charsLeft = 140 - term?.length;
      }
    })
  }

  initializeModalData(anime: LibraryEntry) {
    this.animeMetadata = anime;
    this.addMediaReactionForm.patchValue({ "animeId": anime.animeId })
    this.addMediaReactionForm.patchValue({ "libraryEntryId": anime.id })
  }

  onMediaReactionAddSubmit() {
    var data = new FormData();
    if (this.animeId !== null) {
      data.append('animeId', this.animeId.value);
    }
    if (this.libraryEntryId !== null) {
      data.append('libraryEntryId', this.libraryEntryId.value);
    }
    if (this.reaction !== null && this.reaction.value !== null) {
      data.append('reaction', this.reaction.value)
    }

    this.usersService.addMediaReaction(data)
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
