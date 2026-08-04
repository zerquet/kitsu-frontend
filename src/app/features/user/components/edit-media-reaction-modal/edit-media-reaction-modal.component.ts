import { Component, inject, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../../../environments/environment';
import { AppToastService } from '../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { FormControl, FormControlName, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UpdateMediaReactionRequest } from '../../../../shared/contracts/updateMediaReactionRequest.interface';
import { EditMediaReactionModel } from '../../models/edit-media-reaction.model';

@Component({
  selector: 'edit-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-media-reaction-modal.component.html',
  styleUrl: './edit-media-reaction-modal.component.css'
})
export class EditMediaReactionModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private toastService = inject(AppToastService);
  private usersService = inject(UserAnimeService);
  
  public viewModel: EditMediaReactionModel | null = null;
  public environment = environment;

  editMediaReactionForm = new FormGroup({
    reaction: new FormControl(''),
    reactionId: new FormControl(),
    animeId: new FormControl(),
    libraryEntryId: new FormControl(),
    userId: new FormControl('')
  });

  charsLeft = 140;

  ngOnInit(): void {
    this.editMediaReactionForm.controls['reaction'].valueChanges.pipe(

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

  initializeModalData(data: EditMediaReactionModel) {    
    this.viewModel = data;
    this.editMediaReactionForm.patchValue({ 
      animeId: data.animeId,
      libraryEntryId : data.libraryEntryId,
      userId : data.userId,
      reactionId : data.mediaReactionId,
      reaction : data.reaction
    });

    this.charsLeft = 140 - (data.reaction?.length ?? 0);
  }

  onSubmit() {
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
    console.log(req);
    

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
