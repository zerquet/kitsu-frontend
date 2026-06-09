import { Component, inject, Input, OnInit } from '@angular/core';
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
import { AuthService } from '../../../../../auth/services/auth.service';

@Component({
  selector: 'manage-favorites',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, NgbTooltip],
  templateUrl: './manage-favorites.component.html',
  styleUrl: './manage-favorites.component.css'
})
export class ManageFavoritesComponent implements OnInit {
  private usersService = inject(UserAnimeService);
  private animeService = inject(AnimeService); //use setState fn to stop fetching all anime in ctor
  private authService = inject(AuthService);
  @Input() parentModelRef: NgbActiveModal | null = null;

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
      takeUntil(this.destroy$)
    ).subscribe(keyword => this.term$.next(keyword));
  }

  private destroy$ = new Subject<void>();
  term$ = new BehaviorSubject<string>("");
  pendingFavorites$ = this.usersService.favoriteAnimes$;
  //search logic is already duplicated 3 times throughout app. add to service?
  searchResults$ = combineLatest([this.term$]).pipe(
    map(([keyword]) => keyword),
    switchMap(keyword => this.search(keyword)),
    takeUntil(this.destroy$));

  onUnfavoriteClick(animeId: number) {
    let pendingFavorites = this.pendingFavorites$.getValue();
    pendingFavorites = pendingFavorites.filter((a) => a.animeId !== animeId);
    this.pendingFavorites$.next(pendingFavorites);
  }

  onUpdateProfileClick() {
    this.usersService.updateFavoriteAnimes(this.pendingFavorites$.getValue())
      .subscribe({
        next: () => this.parentModelRef?.close()
      });
  }

  onAnimeSelect(anime: Anime) {
    let pendingFavorites = this.pendingFavorites$.getValue();
    let favoriteExists = pendingFavorites.includes(pendingFavorites[pendingFavorites.findIndex(a => a.animeId === anime.id)]);

    if (favoriteExists === false) {
      //*Questionable: Creating instance of FavoriteAnime at this point which is later used in state after saving changes.
      //               Also, authenticated user's userId must always have a value.  */
      let favoriteToAdd: FavoriteAnime = {
        userId: '',
        animeId: 0,
        anime: undefined!
      }
      if (this.authService.authenticatedUser$.value !== null) {
        favoriteToAdd.userId = this.authService.authenticatedUser$.value.id;
        favoriteToAdd.animeId = anime.id;
        favoriteToAdd.anime = anime;
      }
      else {
        return;
      }
      pendingFavorites.push(favoriteToAdd);
      //*Questionable */
      this.pendingFavorites$.next(pendingFavorites);
    }
    this.showSearchResults = false;
    this.term$.next("");
  }

  onFavoriteImageClick() {
    this.parentModelRef?.close();
  }

  private search(term: string) {
    term = term.toLowerCase().trim();
    if (term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }
}
