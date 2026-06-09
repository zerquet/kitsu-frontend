import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntry } from '../../../../../../shared/models/libraryEntry.model';
import { environment } from '../../../../../../../environments/environment';
import { AppToastService } from '../../../../../../shared/services/app-toast.service';
import { UsersService } from '../../../../../../shared/services/users.service';

@Component({
  selector: 'add-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-media-reaction-modal.component.html',
  styleUrl: './add-media-reaction-modal.component.css'
})
export class AddMediaReactionModalComponent {
  public activeModal = inject(NgbActiveModal);
  public animeMetadata: LibraryEntry | null = null;
  public environment = environment;
  public toastService = inject(AppToastService);
  public usersService = inject(UsersService);

  addMediaReactionForm = new FormGroup({
    reaction: new FormControl(''),
    animeId: new FormControl(),
    libraryEntryId: new FormControl(),
    userId: new FormControl('')
  });

  initializeModalData(anime: LibraryEntry, userId: string) {
    this.animeMetadata = anime;
    this.addMediaReactionForm.patchValue({ "animeId": anime.animeId })
    this.addMediaReactionForm.patchValue({ "libraryEntryId": anime.id })
    this.addMediaReactionForm.patchValue({ "userId": userId })
  }

  onMediaReactionAddSubmit() {
    var data = new FormData();
    if (this.animeId !== null) {
      data.append('animeId', this.animeId.value);
    }
    if (this.libraryEntryId !== null) {
      data.append('libraryEntryId', this.libraryEntryId.value);
    }
    if (this.userId !== null && this.userId.value !== null) {
      data.append('userId', this.userId.value);
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
  get userId() { return this.addMediaReactionForm.get('userId') }
  get reaction() { return this.addMediaReactionForm.get('reaction') }
}
