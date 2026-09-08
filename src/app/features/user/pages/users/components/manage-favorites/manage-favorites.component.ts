import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Anime } from '../../../../../../shared/models/anime.model';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AnimeService } from '../../../../../../shared/services/anime.service';
import { environment } from '../../../../../../../environments/environment';
import { FavoriteAnime } from '../../../../../../shared/models/favoriteAnime.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalTitleComponent } from "../../../../../../shared/components/modal-title/modal-title.component";
import { FavoriteAnimeDataService } from '../../../../services/favorite-anime-data.service';

@Component({
  selector: 'manage-favorites',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, NgbTooltip, ModalTitleComponent],
  templateUrl: './manage-favorites.component.html',
  styleUrl: './manage-favorites.component.css'
})
export class ManageFavoritesComponent implements OnInit {
  private userAnimeService = inject(UserAnimeService);
  private animeService = inject(AnimeService); //use setState fn to stop fetching all anime in ctor
  private favoritesDataService = inject(FavoriteAnimeDataService);
  private destroyRef = inject(DestroyRef);
  @Input() parentModalRef: NgbActiveModal | null = null;
  @Input() saveTrigger$: Observable<void> | null = null;

  showSearchResults = false;
  searchAnimesForm = new FormGroup({
    search: new FormControl()
  });
  environment = environment;

  ngOnInit(): void {
    //this.usersService.setFavoriteAnimesState(); commenting out since state is set in user-about?

    this.searchAnimesForm.controls['search'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(keyword => {
        if (keyword && keyword.trim().length > 0)
          this.showSearchResults = true;
        else
          this.showSearchResults = false;
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(keyword => this.term$.next(keyword));

    this.userProfile$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {          
          if (!profile?.displayId) return;
          
          this.userAnimeService.loadFavoriteAnime(profile?.displayId);
        }
      });

    this.saveTrigger$
      ?.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.saveFavorites());   
  }

  term$ = new BehaviorSubject<string>("");
  pendingFavorites$ = this.favoritesDataService.pendingList$;
  //search logic is already duplicated 3 times throughout app. add to service?
  searchResults$ = combineLatest([this.term$]).pipe(
    map(([keyword]) => keyword),
    switchMap(keyword => this.search(keyword)),
    takeUntilDestroyed(this.destroyRef));

  userProfile$ = this.userAnimeService.profile$;

  onUnfavoriteClick(animeId: number) {
    this.favoritesDataService.remove(animeId);   
  }

  private saveFavorites() {
    this.favoritesDataService.commit()
      .subscribe({
        next: () => this.closeModal()
      });
  }

  selectAnime(anime: Anime) {
    if (!this.favoritesDataService.exists(anime.id)) {
      //*Questionable: Creating instance of FavoriteAnime at this point which is later used in state after saving changes.
      //               Also, authenticated user's userId must always have a value.  */
      let newFavorite: FavoriteAnime = {
        animeId: anime.id,
        anime: anime
      }

      this.favoritesDataService.add(newFavorite);
    }
    this.showSearchResults = false;
    this.term$.next("");
  }

  closeModal() {
    this.parentModalRef?.close();
  }

  private search(term: string) {
    term = term.toLowerCase().trim();
    if (term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }
}
