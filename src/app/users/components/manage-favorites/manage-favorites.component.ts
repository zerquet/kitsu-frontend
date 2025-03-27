import { Component, inject, Input, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, Observable, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgbActiveModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AnimeService } from '../../../shared/services/anime.service';
import { NavMenuSearchDataService } from '../../../shared/services/nav-menu-search-data.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'manage-favorites',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, NgbTooltip],
  templateUrl: './manage-favorites.component.html',
  styleUrl: './manage-favorites.component.css'
})
export class ManageFavoritesComponent implements OnInit {
  private usersService = inject(UsersService);
  private animeService = inject(AnimeService); //use setState fn to stop fetching all anime in ctor
  @Input() parentModelRef: NgbActiveModal | null = null;

  showResults = false;
  form = new FormGroup({
    search: new FormControl()
  });
  environment = environment;

  ngOnInit(): void {
    this.usersService.setFavoriteAnimesState();

    this.form.controls['search'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(term => {
        if(term && term.trim().length > 0)
          this.showResults = true;
        else 
        this.showResults = false;
    }),
    takeUntil(this.destroy$))
    .subscribe(term => this.term$.next(term));
  }

  private destroy$ = new Subject<void>();
  term$ = new BehaviorSubject<string>("");
  favorites$ = this.usersService.getFavoriteAnimes();
  newList$ = this.favorites$;
  //search logic is already duplicated 3 times throughout app. add to service?
  searchResults$ = combineLatest([this.term$]).pipe(
      map(([term]) => term),
      switchMap(term => this.search(term)),
      takeUntil(this.destroy$));
  
  private search(term: string) {
      term = term.toLowerCase().trim();
      if(term.length === 0)
        return of([]);
      return this.animeService.miniSearch(term);
  } 

  removeFavorite(anime: Anime) {
    this.newList$.subscribe((animes) => {
      this.newList$ = of(animes.filter((a) => a.id !== anime.id));
    })
  }

  saveChanges() {
    this.newList$.subscribe((animes) => {
      this.usersService.updateFavoriteAnimes(animes);
      this.parentModelRef?.close();
    });
  }

  addFavorite(anime: Anime) {    
    this.newList$.subscribe((animes) => {
      var found = animes.includes(animes[animes.findIndex(a => a.id === anime.id)]);
      
      if(found === false) {
        let pendingList = [...animes];
        pendingList.push(anime);
        this.newList$ = of(pendingList);
      }
      this.showResults = false;
      this.term$.next("");
    });
  }

  closeModal() {
    this.parentModelRef?.close();
  }
}
