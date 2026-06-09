import { Component, inject, OnInit, input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AuthService } from '../../../../../auth/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { GetLibraryEntryResponseDto } from '../../../../dtos/get-library-entry-response.dto';
import { CreateLibraryEntryRequest } from '../../../../../../shared/contracts/createLibraryEntryRequest.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Anime } from '../../../../../../shared/models/anime.model';
import { RegisterComponent } from '../../../../../auth/register/register.component';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'library-entry-status',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './library-entry-status.component.html',
  styleUrl: './library-entry-status.component.css'
})
export class LibraryEntryStatusComponent implements OnInit {
  public authService = inject(AuthService);
  private userAnimeService = inject(UserAnimeService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  animeId = input.required<number>();
  animeEpisodeCount = input.required<number>();
  libraryEntry$ = new BehaviorSubject<GetLibraryEntryResponseDto | null>(null);

  updateLibraryEntryForm = new FormGroup({
    episodeProgress: new FormControl(),
    rating: new FormControl(),
    status: new FormControl(),
  });

  ngOnInit() {
    var animeId = this.route.snapshot.params['id'];

    if (this.authService.authenticatedUser$.getValue() !== null) {
      this.userAnimeService.getLibraryEntry(this.authService.authenticatedUser$.getValue()!.id, animeId)
        .subscribe({
          next: (entry) => {
            this.libraryEntry$.next(entry);
            if (entry === null) return;

            this.updateLibraryEntryForm.patchValue({ "episodeProgress": entry.episodesWatched });
            this.updateLibraryEntryForm.patchValue({ "status": entry.watchStatus });
            this.updateLibraryEntryForm.patchValue({ "rating": entry.userRating });
          }
        });
      //commenting out because GetAnimeById already returns isFavorite data
      // this.usersService.getFavoriteAnime(animeId)
      //   .subscribe({
      //     next: (res) => this.isFavorite$.next(res !== null)
      //   });
    }

  }

  onIncrementProgressClick(episodeCount: number) {
    const currentProgress = this.episodeProgress?.value;
    if (currentProgress + 1 <= episodeCount) {
      this.episodeProgress?.patchValue(currentProgress + 1);
    }
  }

  onAddToLibraryClick(libraryName: string) {
    if (this.authService.authenticatedUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      const episodesCompleted = libraryName === 'completed' ? this.animeEpisodeCount() : 0;
      let req: CreateLibraryEntryRequest = {
        animeId: this.animeId(),
        watchStatus: libraryName,
        episodesWatched: episodesCompleted!
      }

      this.userAnimeService.createEntry(req)
        .subscribe({
          next: (res) => {
            this.updateLibraryEntryForm.patchValue({ "episodeProgress": episodesCompleted });
            this.updateLibraryEntryForm.patchValue({ "status": libraryName });
            this.libraryEntry$.next(res);
            //above line is somehow both CreateLibraryEntryResponseDto and GetLibraryEntryResponseDto
            //maybe because they have the same properties? Since this state tracks the status block on the page. 
            //Merge the two dtos to one like UserAnimeStatusBlock? Or map the response Dtos to this new one and set
            //libraryEntry$'s type to UserAnimeStatusBlock?
            //same deal for the onUpdateLibraryEntryFormSubmit method below. 
            //even more reason to move this "User Anime Status Block" to its own component. 
          }
        });
    }
  }

  onUpdateLibraryEntryFormSubmit() {
    let cached = this.libraryEntry$.value;
    if (!cached)
      return;

    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: cached.libraryEntryId,
      episodesWatched: 0,
    }

    if (this.episodeProgress) {
      req.episodesWatched = this.episodeProgress.value
    }
    if (this.status) {
      req.watchStatus = this.status.value
    }
    if (this.rating) {
      req.userRating = this.rating.value
    }

    this.userAnimeService.updateEntry(req)
      .subscribe({
        next: (res) => {
          this.updateLibraryEntryForm.patchValue({ "episodeProgress": req.episodesWatched });
          this.updateLibraryEntryForm.patchValue({ "status": req.watchStatus });
          this.updateLibraryEntryForm.patchValue({ "rating": req.userRating });
          this.libraryEntry$.next(res)
        }
      });
  }

  onDeleteEntryBtnClick = () => {
    this.userAnimeService.deleteEntry(this.animeId())
      .subscribe({
        next: () => this.libraryEntry$.next(null),
        //if an error happens, we should handles this. If api returns null, user is shown the add to library btns
        // and if they press them again, it could add the same anime twice to their library. add prevention of this
        //in api and handle errors gracefully in frontend. 
      });
  }

  /**FORM GETTERS */
  get episodeProgress() { return this.updateLibraryEntryForm.get("episodeProgress"); }

  get rating() { return this.updateLibraryEntryForm.get("rating"); }

  get status() { return this.updateLibraryEntryForm.get("status"); }
}
