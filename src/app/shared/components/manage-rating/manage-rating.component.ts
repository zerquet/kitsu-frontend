import { Component, inject, Input, OnInit, viewChild } from '@angular/core';
import { NgbPopover, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntryDetail } from '../../models/library-entry.model';
import { UserAnimeService } from '../../services/user-anime.service';
import { UpdateLibraryEntryRequest } from '../../contracts/updateLibraryEntryRequest.interface';
import { UpperCasePipe } from '@angular/common';
import { RatingOptionsComponent } from "../rating-options/rating-options.component";
import { RATING_OPTIONS } from '../../constants/constants';

@Component({
  selector: 'manage-rating',
  standalone: true,
  imports: [NgbPopover, UpperCasePipe, RatingOptionsComponent],
  templateUrl: './manage-rating.component.html',
  styleUrl: './manage-rating.component.css'
})
export class ManageRatingComponent {
  private userAnimeService = inject(UserAnimeService);
  @Input() libraryEntry: LibraryEntryDetail | undefined;
  ratingOptionsPopover = viewChild(NgbPopover);
  
  get currentRatingOption() {
    return RATING_OPTIONS.find(r => r.userRating === this.libraryEntry?.userRating);
  }

  removeRating() {
    this.updateRating(0);
  }

  updateRating(userRating: number) {
    if (!this.libraryEntry)
      return;

    const req: UpdateLibraryEntryRequest = {
      libraryEntryId: this.libraryEntry.id,
      episodesWatched: this.libraryEntry.episodesWatched,
      userRating: userRating,
      watchStatus: this.libraryEntry.watchStatus
    };

    this.userAnimeService.updateEntry(req)
      .subscribe(() => {
        this.ratingOptionsPopover()?.close();
      });
  }
}
