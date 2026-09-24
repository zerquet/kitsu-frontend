import { Component, EventEmitter, inject, Input, Output, viewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { RATING_OPTIONS } from '../../constants/constants';
import { UpdateLibraryEntryRequest } from '../../contracts/updateLibraryEntryRequest.interface';
import { LibraryEntryDetail } from '../../models/library-entry.model';
import { UserAnimeService } from '../../services/user-anime.service';
import { RatingOptionsComponent } from "../rating-options/rating-options.component";
import { UpperCasePipe } from '@angular/common';

@Component({
  selector: 'manage-rating-form',
  standalone: true,
  imports: [RatingOptionsComponent, NgbPopover, UpperCasePipe],
  templateUrl: './manage-rating-form.component.html',
  styleUrl: './manage-rating-form.component.css'
})
export class ManageRatingFormComponent {
  @Input() libraryEntry: LibraryEntryDetail | undefined;
  @Input() readonly: boolean = false;
  @Output() ratingChange = new EventEmitter<number>();
  ratingOptionsPopover = viewChild(NgbPopover);
  
  get currentRatingOption() {
    //TODO: this runs too many times when it should only run 4 times. console log and see
    return RATING_OPTIONS.find(r => r.userRating === this.libraryEntry?.userRating);
  }

  removeRating() {
    this.updateRating(0);
  }

  updateRating(userRating: number) {
    if (!this.libraryEntry)
      return;

    this.ratingChange.emit(userRating);
    this.ratingOptionsPopover()?.close();
    this.libraryEntry= {...this.libraryEntry, userRating: userRating};
  }
}
