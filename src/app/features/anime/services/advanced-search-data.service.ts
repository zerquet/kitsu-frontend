import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AnimeService } from '../../../shared/services/anime.service';
import { Anime } from '../../../shared/models/anime.model';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchDataService {
  /**This is a service that holds methods, properties, and state of the /search page. This allows multiple components to talk to the same service elegantly/share the same state */
  private animeService = inject(AnimeService);

  constructor() {
    this.setSearchResultsState();
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
  sortOption$ = new BehaviorSubject('Title'); //see library component for reference.
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
    switchMap(() => this.fetchSearchResults()),
    takeUntil(this.destroy$)
  );
  filteredSearchResults$ = combineLatest([
    this.results$,
    this.sortOption$
  ]).pipe(
    map(([list, sortOption]) => this.sorter(list, sortOption))
  )

  private fetchSearchResults(): Observable<Anime[]> {
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

  private sorter(list: Anime[], column: string): Anime[] {
    if (column === "Title") {
      list.sort((a, b) => a.title < b.title ? -1 : 1)
    }
    else if (column === "Rating") {
      list.sort((a, b) => a.score! < b.score! ? 1 : -1)
    }

    return list;
  }

  setSearchResultsState() {
    this.results$ = this.results$.pipe(
      tap((res) => {
        if (res.length === 0) {
          return this.fetchSearchResults();
        }
        return res;
      })
    )
  }
}
