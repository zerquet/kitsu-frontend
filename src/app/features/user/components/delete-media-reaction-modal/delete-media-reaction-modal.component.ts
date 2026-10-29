import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalTitleComponent } from "../../../../shared/components/modal-title/modal-title.component";

@Component({
  selector: 'delete-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule, ModalTitleComponent],
  template: `
    <div id="delete-modal-title">
      <modal-title title="Are you sure you want to do this?"/>
    </div>
    <div class="delete-reaction-modal">
      <form
        [formGroup]="deleteMediaReactionForm"
        (submit)="onSubmit()"
      >
        <div class="delete-btn-container">
          <input id="delete-reaction-btn" type="submit" value="Confirm" [disabled]="submitting">
        </div>
      </form>
    </div>
    `,
  styles: `
    :host {
      border-radius: 5px;
    }
    .delete-reaction-modal {
      border-radius: 5px;
      padding: 15px;
      text-align: center;
    }
    .delete-btn-container, .delete-btn-container input {
      width: 100%;
    }
    #delete-modal-title {
      text-align: center;
      padding: 20px 20px 5px 20px;
      border-bottom: 1px solid #e5e5e5;
    }
    #delete-reaction-btn {
      background-color: #16a085;
      border-style: none;
      border-radius: 3px;
      color: #fff;
      padding: 10px 20px;
      font-size: 24px;
    }
    #delete-reaction-btn:hover {
      background-color: #19b698;
    }
    #delete-reaction-btn[disabled],
    #delete-reaction-btn[disabled]:hover {
      background-color: #B4B4B4;
      cursor: not-allowed;
    }
  `
})
export class DeleteMediaReactionModalComponent implements OnInit {
  public activeModal = inject(NgbActiveModal);
  public toastService = inject(AppToastService);
  public usersService = inject(UserAnimeService);
  private userAnimeService = inject(UserAnimeService);
  private destroyRef = inject(DestroyRef);

  deleteMediaReactionForm!: FormGroup;
  submitting = false;

  ngOnInit() {
    this.userAnimeService.currentMediaReaction$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(mediaReaction => {
        this.deleteMediaReactionForm = new FormGroup({
            reactionId: new FormControl(mediaReaction?.id)
          });
      });
  }

  onSubmit() {
    if (this.submitting) return;

    if (this.reactionId !== null && this.reactionId.value !== null) {
      this.submitting = true;
      // Only reset submitting on error; on success the modal is closing and the button must stay disabled.
      this.usersService.deleteMediaReaction(this.reactionId.value)
        .subscribe({
          next: () => {
            this.activeModal.close();
            this.toastService.show('Success', 'Reaction deleted!')
          },
          error: (err) => {
            this.submitting = false;
            this.toastService.show('Error', err);
          }
        })
    }
  }

  get reactionId() { return this.deleteMediaReactionForm.get('reactionId') }
}
