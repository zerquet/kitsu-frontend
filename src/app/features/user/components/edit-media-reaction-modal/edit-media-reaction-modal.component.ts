import { Component, inject, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateMediaReactionRequestDto } from '../../../../shared/contracts/update-media-reaction-request.dto';
import { filter, switchMap, tap } from 'rxjs';
import { MediaReaction } from '../../../../shared/models/media-reaction.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'edit-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgbTooltip],
  templateUrl: './edit-media-reaction-modal.component.html',
  styleUrl: './edit-media-reaction-modal.component.css'
})
export class EditMediaReactionModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private toastService = inject(AppToastService);
  private userAnimeService = inject(UserAnimeService);
  public environment = environment;

  mediaReaction$ = this.userAnimeService.currentMediaReaction$;
  editMediaReactionForm!: FormGroup;

  charsLeft = 140;

  ngOnInit(): void {
    this.mediaReaction$
      .pipe(
        filter((mediaReaction): mediaReaction is MediaReaction => !!mediaReaction),
        tap(mediaReaction => {
          this.editMediaReactionForm = new FormGroup({
            reaction: new FormControl(mediaReaction.reaction),
            reactionId: new FormControl(mediaReaction.id),
            animeId: new FormControl(mediaReaction.animeId),
            libraryEntryId: new FormControl(mediaReaction.libraryEntryId),
            userId: new FormControl(mediaReaction.userId)
          });

          this.charsLeft = 140 - (mediaReaction.reaction.length ?? 0);
        }),
        switchMap(() => this.editMediaReactionForm.controls['reaction'].valueChanges)
      )
      .subscribe(term => {
        this.charsLeft = term?.length ? 140 - term.length : 140;
      });
    
  }

  deleteReaction(mediaReactionId: number) {
    this.userAnimeService.deleteMediaReaction(mediaReactionId)
      .subscribe(() => this.activeModal.close())
  }

  onSubmit() {
    let req: UpdateMediaReactionRequestDto = {
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

    this.userAnimeService.updateMediaReaction(req)
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
