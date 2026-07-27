import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { LibraryEntry, LibraryEntryDetail } from '../../../../../../shared/models/library-entry.model';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ManageLibraryEntryModalComponent } from '../../../../../../shared/components/manage-library-entry-modal/manage-library-entry-modal.component';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { environment } from '../../../../../../../environments/environment';
import { AddMediaReactionModalComponent } from '../add-media-reaction-modal/add-media-reaction-modal.component';
import { UpdateLibraryEntryRequest } from '../../../../../../shared/contracts/updateLibraryEntryRequest.interface';
import { UsersService } from '../../../../../../shared/services/users.service';
import { MediaReaction } from '../../../../../../shared/models/mediaReaction.model';
import { EditMediaReactionModalComponent } from '../../../../components/edit-media-reaction-modal/edit-media-reaction-modal.component';
import { EditMediaReactionModel } from '../../../../models/edit-media-reaction.model';
import { progressIsValid } from '../../../../../../shared/validators/validators';
import { AddMediaReactionModel } from '../../../../models/add-media-reaction.model';

@Component({
  selector: 'users-library',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, AsyncPipe, RouterLink, NgbTooltip],
  templateUrl: './users-library.component.html',
  styleUrl: './users-library.component.css'
})
export class UsersLibraryComponent implements OnInit {
  private userAnimeService = inject(UserAnimeService);
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);

  private renderer = inject(Renderer2).listen("window", "click", (e: Event) => {
    //when all dropdowns are not shown, ratingEditMenu will be undefined. Return since we don't need to do anything else.
    //Only run when the dropdown is not clicked. Otherwise, all clicks (including on the dropdown) get into this and the menu will never close
    if (this.ratingCellMode === "edit" && this.ratingEditMenu !== undefined && e.target !== this.ratingEditMenu.nativeElement) {
      this.ratingCellMode = "read";
      this.currAnimeIdForEditingRating = -1;
    }
    if (this.progressCellMode === "edit" && this.progressEditField !== undefined && e.target !== this.progressEditField.nativeElement) {
      this.progressCellMode = "read";
      this.currAnimeIdForEditingProgress = -1;
      //Save when user clicks out.
      if (this.pendingProgressUpdate !== undefined) {
        let req: UpdateLibraryEntryRequest = {
          libraryEntryId: this.pendingProgressUpdate.id,
          episodesWatched: this.pendingProgressUpdate.episodesWatched,
          userRating: this.pendingProgressUpdate.userRating,
          watchStatus: this.pendingProgressUpdate.watchStatus
        };

        this.userAnimeService.updateEntry(req)
          .subscribe({
            next: () => this.pendingProgressUpdate = undefined
          });
      }
    }
  })

  searchLibraryForm: FormGroup = new FormGroup({ search: new FormControl() });
  ratingCellMode = "read";
  currAnimeIdForEditingRating = -1;
  progressCellMode = "read";
  currAnimeIdForEditingProgress = -1;
  pendingProgressUpdate: LibraryEntry | undefined = undefined;
  environment = environment;
  librarySearchNoResults = false;

  ngOnInit(): void {
    this.searchLibraryForm.controls["search"].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe({
      next: (keyword) => this.searchTerm$.next(keyword.toLowerCase())
    });

    this.route.params.subscribe({
      next: (params) => {
        this.userAnimeService.loadUserLibrary(params['id']);
      }
    });
  }

  library$ = this.userAnimeService.library$;
  sortDirection$ = new BehaviorSubject("asc");
  sortOption$ = new BehaviorSubject("Title");
  libraryType$ = new BehaviorSubject("all");
  searchTerm$ = new BehaviorSubject("");

  userProfile$ = this.userAnimeService.profile$;
  canEdit$ = this.usersService.canEdit$;

  //When behavior subject values are updated, the filtered list is too.
  //https://chatgpt.com/share/675410d9-9a68-8003-9599-c495ff36fb9e
  filteredAnimeList$ = combineLatest([
    this.library$,
    this.sortDirection$,
    this.sortOption$,
    this.libraryType$,
    this.searchTerm$
  ]).pipe(
    map(([list, sortDirection, sortOption, libraryType, searchTerm]) =>
      //similar methods as sorter() didnt need arguments passed (advanced, mini search). copy from to here? it's using the same behavior subject pattern..
      this.sorter(list, sortOption, sortDirection, libraryType, searchTerm))
  );

  @ViewChild("ratingEditMenu") ratingEditMenu!: ElementRef;
  @ViewChild("progressEditField") progressEditField!: ElementRef;

  //COMPONENT METHODS
  selectLibraryType = (type: string) => this.libraryType$.next(type);

  selectSortOption = (option: string) => this.sortOption$.next(option);

  toggleSortDirection(tooltip: NgbTooltip) {
    tooltip.close();
    const val = this.sortDirection$.value === "asc" ? "desc" : "asc";
    this.sortDirection$.next(val);
  }

  getTooltipInfo() {
    let tooltipInfo = '';
    let direction = this.sortDirection$.value;
    let option = this.sortOption$.value;

    if (option === 'Title')
      tooltipInfo = direction === 'desc' ? 'Z-A' : 'A-Z';

    if (option === 'Length')
      tooltipInfo = direction === 'desc' ? 'Shortest First' : 'Longest First';

    if (option === 'Rating')
      tooltipInfo = direction === 'desc' ? 'Lowest First' : 'Highest First';

    return tooltipInfo;
  }

  onEditMoreBtnClick(libraryEntry: LibraryEntry) { //can this be handled by service?    
    const modal = this.modalService.open(ManageLibraryEntryModalComponent);
    modal.componentInstance.initializeModalData({ ...libraryEntry });
  }

  onRatingClick(animeId: number) {
    this.ratingCellMode = this.ratingCellMode === "read" ? "edit" : "read";
    this.currAnimeIdForEditingRating = animeId;
  }

  onProgressClick(animeId: number) {
    this.progressCellMode = this.progressCellMode === "read" ? "edit" : "read";
    this.currAnimeIdForEditingProgress = animeId;
  }

  onProgressChange(libraryEntry: LibraryEntryDetail, event: Event) {
    //Save changes when user updates progress by +/-'ing so the rendered event listener can have access to it. //TODO check if this comment is still accurate. belongs below?
    let newProgress = Number((event.target as HTMLInputElement).value);
    if (!progressIsValid(newProgress, libraryEntry.anime.episodeCount)) {
      return;
    }

    let pending = { ...libraryEntry };
    pending.episodesWatched = newProgress;
    this.pendingProgressUpdate = pending;
  }

  onProgressAddClick(libraryEntry: LibraryEntryDetail) {
    let newProgress = libraryEntry.episodesWatched + 1;
    if (!progressIsValid(newProgress, libraryEntry.anime.episodeCount)) {
      return;
    }

    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: libraryEntry.id,
      episodesWatched: newProgress,
      userRating: libraryEntry.userRating,
      watchStatus: libraryEntry.watchStatus
    };
    this.userAnimeService.updateEntry(req)
      .subscribe({
        next: () => this.pendingProgressUpdate = undefined
      });
  }

  onRatingValueSelect(libraryEntry: LibraryEntry, newRating: string) {
    let req: UpdateLibraryEntryRequest = {
      libraryEntryId: libraryEntry.id,
      episodesWatched: libraryEntry.episodesWatched,
      userRating: Number(newRating),
      watchStatus: libraryEntry.watchStatus
    };
    this.userAnimeService.updateEntry(req)
      .subscribe();
  }

  getLibraryTypeCount(list: LibraryEntry[], type: string) {
    return list.filter(a => a.watchStatus === type).length;
  }

  onAddMediaReaction(libraryEntry: LibraryEntryDetail) {
    const data: AddMediaReactionModel = {
      libraryEntryId: libraryEntry.id,
      animeId: libraryEntry.animeId,
      animeImageUrl: libraryEntry.anime.imageUrl,
      animeTitle: libraryEntry.anime.title
    }
    const modal = this.modalService.open(AddMediaReactionModalComponent);
    modal.componentInstance.initializeModalData(data);
  }

  onEditMediaReactionClick(reaction: MediaReaction) {
    const data: EditMediaReactionModel = {
      reactionId: reaction.id,
      userId: reaction.userId,
      libraryEntryId: reaction.libraryEntryId,
      animeId: reaction.animeId,
      reaction: reaction.reaction,
      animeTitle: reaction.animeTitle,
      animeImageUrl: reaction.animeImageUrl
    }
    const modal = this.modalService.open(EditMediaReactionModalComponent);
    modal.componentInstance.initializeModalData(data)
  }

  private sorter(list: LibraryEntryDetail[], column: string, direction: string, library: string, searchTerm: string): LibraryEntryDetail[] {
    this.librarySearchNoResults = false;

    if (library !== "all")
      list = list.filter(i => i.watchStatus === library);

    if (searchTerm !== "") {
      list = list.filter(j => j.anime.title.toLocaleLowerCase().includes(searchTerm));
      this.librarySearchNoResults = list.length === 0;
    }


    if (column === "Title") {
      if (direction === "asc")
        list.sort((a, b) => a.anime.title < b.anime.title ? -1 : 1)
      else
        list.sort((a, b) => a.anime.title < b.anime.title ? 1 : -1)
    }
    else if (column === "Length") {
      if (direction === "asc")
        list.sort((a, b) => a.anime.episodeCount! < b.anime.episodeCount! ? 1 : -1)
      else
        list.sort((a, b) => a.anime.episodeCount! < b.anime.episodeCount! ? -1 : 1)
    }
    else if (column === "Rating") {
      if (direction === "asc")
        list.sort((a, b) => a.userRating! < b.userRating! ? 1 : -1)
      else
        list.sort((a, b) => a.userRating! < b.userRating! ? -1 : 1)
    }

    return list;
  }

  //FORM GETTERS
  get search() { return this.searchLibraryForm.get('search'); }
}
