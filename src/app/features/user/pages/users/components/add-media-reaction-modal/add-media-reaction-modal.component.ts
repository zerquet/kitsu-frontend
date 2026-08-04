import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntry, LibraryEntryDetail } from '../../../../../../shared/models/library-entry.model';
import { environment } from '../../../../../../../environments/environment';
import { AppToastService } from '../../../../../../shared/services/app-toast.service';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AddMediaReactionModel } from '../../../../models/add-media-reaction.model';

@Component({
  selector: 'add-media-reaction',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-media-reaction-modal.component.html',
  styleUrl: './add-media-reaction-modal.component.css'
})
export class AddMediaReactionModalComponent implements OnInit {
  private activeModal = inject(NgbActiveModal);
  private toastService = inject(AppToastService);
  private usersService = inject(UserAnimeService);
  
  public viewModel: AddMediaReactionModel | null = null;
  public environment = environment;

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

  initializeModalData(data: AddMediaReactionModel) {
    this.viewModel = data;
    this.addMediaReactionForm.patchValue({
      animeId: data.animeId,
      libraryEntryId: data.libraryEntryId
    });
  }

  onSubmit() {
    var req = new FormData();
    if (this.animeId !== null) {
      req.append('animeId', this.animeId.value);
    }
    if (this.libraryEntryId !== null) {
      req.append('libraryEntryId', this.libraryEntryId.value);
    }
    if (this.reaction !== null && this.reaction.value !== null) {
      req.append('reaction', this.reaction.value)
    }

    this.usersService.addMediaReaction(req)
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
