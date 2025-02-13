import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { CommonModule } from '@angular/common';
import { AnimeGridComponent } from '../../components/anime-grid/anime-grid.component';
import { AdvancedSearchComponent } from '../../components/advanced-search/advanced-search.component';
import { FilterOptionsComponent } from '../../components/filter-options/filter-options.component';
import { SortDropdownComponent } from '../../components/sort-dropdown/sort-dropdown.component';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FilterOptionsComponent,
    AnimeGridComponent,
    AdvancedSearchComponent,
    SortDropdownComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent implements OnDestroy {
  private animeService = inject(AnimeService);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  term$ = new BehaviorSubject('');
  minRating$ = new BehaviorSubject('5');
  maxRating$ = new BehaviorSubject('100');
  minYear$ = new BehaviorSubject('1975');
  maxYear$ = new BehaviorSubject('2025');
  minEpisodes$ = new BehaviorSubject('1');
  maxEpisodes$ = new BehaviorSubject('100');
  isTv$ = new BehaviorSubject(false);
  isMovie$ = new BehaviorSubject(false);
  //add sort options

  results$ = combineLatest([
    this.term$,
    this.minRating$,
    this.maxRating$,
    this.minYear$,
    this.maxYear$,
    this.minEpisodes$,
    this.maxEpisodes$,
    this.isTv$,
    this.isMovie$,
  ]).pipe(
    switchMap(() => this.getAdvancedResults()),
    takeUntil(this.destroy$)
  );

  onFormChange = (term: string) => this.term$.next(term);

  onFiltersChange = (
    prop: {
      value: string, 
      filter: 'minYear$' | 'maxYear$' | 'minRating$' | 'maxRating$' | 'minEpisodes$' | 'maxEpisodes$'
    }
  ) => this[prop.filter].next(prop.value);

  onMediaTypesChange = (filter: 'isTv$' | 'isMovie$') => this[filter].next(!this[filter].getValue())
  
  private getAdvancedResults(): Observable<Anime[]> {
    return this.animeService.advancedSearch(
      this.term$.value, 
      this.minYear$.value, 
      this.maxYear$.value, 
      this.minRating$.value, 
      this.maxRating$.value, 
      this.minEpisodes$.value, 
      this.maxEpisodes$.value, 
      this.isTv$.value, 
      this.isMovie$.value
    );
  }
}
