import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, inject, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { LibraryEntry } from '../../../shared/models/libraryEntry.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LibraryEntryComponent } from '../library-entry/library-entry.component';
import { UsersService } from '../../../shared/services/users.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, AsyncPipe, RouterLink],
  templateUrl: './library.component.html',
  styleUrl: './library.component.css'
})
export class LibraryComponent implements OnInit  {
  public authService = inject(AuthService);
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);

  private renderer = inject(Renderer2).listen("window", "click", (e: Event) => {
    //when all dropdowns are not shown, ratingEditMenu will be undefined. Return since we don't need to do anything else.
    //Only run when the dropdown is not clicked. Otherwise, all clicks (including on the dropdown) get into this and the menu will never close
    if(this.ratingCellMode === "edit" && this.ratingEditMenu !== undefined && e.target !== this.ratingEditMenu.nativeElement) {
      this.ratingCellMode = "read";
      this.currAnimeIdForEditingRating = -1;
    }
    if(this.progressCellMode === "edit" && this.progressEditField !== undefined && e.target !== this.progressEditField.nativeElement) {
      this.progressCellMode = "read";
      this.currAnimeIdForEditingProgress = -1;
      //Save when user clicks out.
      if(this.pendingProgressUpdate !== undefined) {
        this.updateProgress(this.pendingProgressUpdate.id, this.pendingProgressUpdate.episodesWatched)
      }
    }
  })

  form: FormGroup = new FormGroup({ search: new FormControl() }); 
  ratingCellMode = "read";
  currAnimeIdForEditingRating = -1;
  progressCellMode = "read";
  currAnimeIdForEditingProgress = -1;
  pendingProgressUpdate: LibraryEntry | undefined = undefined;
  environment = environment;

  ngOnInit(): void {
    this.form.controls["search"].valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe((term) => 
        this.searchTerm$.next(term.toLowerCase())
    ); 
    //use (input) instead to avoid
    this.usersService.setLibraryState(this.route.snapshot.params['id']); //this needs to react to the route param for userid. 
  }

  library$ = this.usersService.library$;
  sortDirection$ = new BehaviorSubject("asc");
  sortOption$ = new BehaviorSubject("Title");
  libraryType$ = new BehaviorSubject("all");
  searchTerm$ = new BehaviorSubject("");

  userProfile$ = this.usersService.getCurrentUserProfile();

  //When behavior subject values are updated, the filteted list is too.
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
  changeLibraryType = (type: string) => this.libraryType$.next(type);

  changeSortOption = (option: string) => this.sortOption$.next(option);

  toggleDirection() {
    const val = this.sortDirection$.value === "asc" ? "desc": "asc";
    this.sortDirection$.next(val);
  }

  openEditModal(entry: LibraryEntry) { //can this be handled by service?    
    const modal = this.modalService.open(LibraryEntryComponent);
    modal.componentInstance.initializeModalData({...entry});
  }

  onRatingClick(animeId: number) {
    this.ratingCellMode = this.ratingCellMode === "read" ? "edit": "read";
    this.currAnimeIdForEditingRating = animeId;
  }

  onProgressClick(animeId: number) {
    this.progressCellMode = this.progressCellMode === "read" ? "edit": "read";
    this.currAnimeIdForEditingProgress = animeId;
  }

  onProgressChange(entry: LibraryEntry, event: Event) {
    //Save changes when user updates progress by +/-'ing so the rendered event listener can have access to it. //TODO check if this comment is still accurate. belongs below?
    let potential = {...entry};
    potential.episodesWatched = Number((event.target as HTMLInputElement).value);
    this.pendingProgressUpdate = potential;
  }

  onIncrementProgressClick(entryId: number, progress: number) { 
    this.updateProgress(entryId, progress += 1);
  }

  updateRating(entryId: number, newRating: string) { 
    this.usersService.updateEntryRating(entryId, newRating);
  }
  
  updateProgress(entryId: number, newProgress: number) {
    this.usersService.updateEntryProgress(entryId, newProgress);
    this.pendingProgressUpdate = undefined;
  }

  private sorter(list: LibraryEntry[] ,column: string, direction: string, library: string, searchTerm: string): LibraryEntry[] {    
    if(library !== "all")
      list = list.filter(i => i.watchStatus === library);

    if(searchTerm !== "")
      list = list.filter(j => j.animeInfo!.title.toLocaleLowerCase().includes(searchTerm));

    if(column === "Title")
    {
      if(direction === "asc")
        list.sort((a, b) => a.animeInfo!.title < b.animeInfo!.title ? -1 : 1)
      else
        list.sort((a, b) => a.animeInfo!.title < b.animeInfo!.title ? 1 : -1)
    }
    else if(column === "Length")
    {
      if(direction === "asc")
        list.sort((a, b) => a.animeInfo!.episodeCount! < b.animeInfo!.episodeCount! ? -1 : 1)
      else
        list.sort((a, b) => a.animeInfo!.episodeCount! < b.animeInfo!.episodeCount! ? 1 : -1)
    }
    else if(column === "Rating")
    {
      if(direction === "asc")
        list.sort((a, b) => a.userRating! < b.userRating! ? -1 : 1)
      else
        list.sort((a, b) => a.userRating! < b.userRating! ? 1 : -1)
    }

    return list;
  }

  //FORM GETTERS
  get search() { return this.form.get('search'); }
}
