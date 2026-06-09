import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';

@Component({
  selector: 'delete-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="delete-reaction-modal">
      <h3>Are you sure you want to do this?</h3>
      <form
        [formGroup]="deleteMediaReactionForm"
        (submit)="onMediaReactionDeleteSubmit()"
      >
        <div class="delete-btn-container">
          <input type="submit" value="Confirm">
        </div>
      </form>
    </div>
    `,
  styles: `
    :host {
      border-radius: 5px;
    }
    .delete-reaction-modal {
      background-color: #323242;
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    .delete-btn-container, .delete-btn-container input {
      width: 100%;
    }
  `
})
export class DeleteMediaReactionModalComponent {
  public activeModal = inject(NgbActiveModal);
  public toastService = inject(AppToastService);
  public usersService = inject(UserAnimeService);

  deleteMediaReactionForm = new FormGroup({
    reactionId: new FormControl()
  });

  initializeModalData(reactionId: number) {
    this.deleteMediaReactionForm.patchValue({ "reactionId": reactionId })
  }

  onMediaReactionDeleteSubmit() {
    if (this.reactionId !== null && this.reactionId.value !== null) {
      this.usersService.deleteMediaReaction(this.reactionId.value)
        .subscribe({
          next: () => {
            this.activeModal.close();
            this.toastService.show('Success', 'Reaction deleted!')
          },
          error: (err) => {
            this.toastService.show('Error', err);
          }
        })
    }
  }

  get reactionId() { return this.deleteMediaReactionForm.get('reactionId') }
}
