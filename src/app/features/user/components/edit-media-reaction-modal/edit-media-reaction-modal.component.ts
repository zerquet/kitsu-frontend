import { Component, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { LibraryEntry } from '../../../../shared/models/libraryEntry.model';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { UsersService } from '../../../../shared/services/users.service';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateMediaReactionRequest } from '../../../../shared/contracts/updateMediaReactionRequest.interface';

export interface EditMediaReactionModel {
  reactionId: number,
  userId: string | undefined,
  libraryEntryId: number | undefined,
  animeId: number | undefined,
  reaction: string | undefined,
  animeTitle: string | undefined,
  animeImageUrl: string | undefined,
}

@Component({
  selector: 'edit-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-media-reaction-modal.component.html',
  styleUrl: './edit-media-reaction-modal.component.css'
})
export class EditMediaReactionModalComponent {
  public activeModal = inject(NgbActiveModal);
  public model: EditMediaReactionModel | null = null;
  public environment = environment;
  public toastService = inject(AppToastService);
  public usersService = inject(UsersService);

  editMediaReactionForm = new FormGroup({
    reaction: new FormControl(''),
    reactionId: new FormControl(),
    animeId: new FormControl(),
    libraryEntryId: new FormControl(),
    userId: new FormControl('')
  });

  initializeModalData(data: EditMediaReactionModel) {
    this.model = data;
    this.editMediaReactionForm.patchValue({ "animeId": data.animeId })
    this.editMediaReactionForm.patchValue({ "libraryEntryId": data.libraryEntryId })
    this.editMediaReactionForm.patchValue({ "userId": data.userId })
    this.editMediaReactionForm.patchValue({ "reactionId": data.reactionId })
    this.editMediaReactionForm.patchValue({ "reaction": data.reaction })
  }

  onMediaReactionEditSubmit() {
    let req: UpdateMediaReactionRequest = {
      reactionId: 0,
      reaction: ""
    };

    if (this.reactionId !== null && this.reactionId.value !== null) {
      req.reactionId = this.reactionId.value;
    }
    if (this.reaction !== null && this.reaction.value !== null) {
      req.reaction = this.reaction.value;
    }
    else {
      //Reaction was not updated.
      return;
    }

    this.usersService.updateMediaReaction(req)
      .subscribe({
        next: () => {
          this.activeModal.close();
          this.toastService.show('Success', 'Reaction updated!')
        },
        error: (err) => {
          this.toastService.show('Error', err)
        }
      })
  }

  get reactionId() { return this.editMediaReactionForm.get('reactionId') }
  get animeId() { return this.editMediaReactionForm.get('animeId') }
  get libraryEntryId() { return this.editMediaReactionForm.get('libraryEntryId') }
  get userId() { return this.editMediaReactionForm.get('userId') }
  get reaction() { return this.editMediaReactionForm.get('reaction') }
}
