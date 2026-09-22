import { Component, inject, Input, viewChild } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { RATING_OPTIONS } from '../../../../../../shared/constants/constants';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';
import { LibraryEntryDetail } from '../../../../../../shared/models/library-entry.model';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { RatingOptionsComponent } from "../../../../../../shared/components/rating-options/rating-options.component";

@Component({
  selector: 'manage-rating-library',
  standalone: true,
  imports: [RatingOptionsComponent, NgbPopover],
  templateUrl: './manage-rating-library.component.html',
  styleUrl: './manage-rating-library.component.css'
})
export class ManageRatingLibraryComponent {
private userAnimeService = inject(UserAnimeService);
  @Input() libraryEntry: LibraryEntryDetail | undefined;
  @Input() readonly: boolean = false;
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
