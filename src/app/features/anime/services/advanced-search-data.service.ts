import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, delay, map, Observable, startWith, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AnimeService } from '../../../shared/services/anime.service';
import { Anime } from '../../../shared/models/anime.model';
import { DEFAULT_IS_MOVIE, DEFAULT_IS_TV, DEFAULT_MAX_EPS, DEFAULT_MAX_RATING, DEFAULT_MAX_YEAR, DEFAULT_MIN_EPS, DEFAULT_MIN_RATING, DEFAULT_MIN_YEAR, DEFAULT_SORT_OPTION } from '../../../shared/constants/constants';

@Injectable({
  providedIn: 'root'
})
export class AdvancedSearchDataService {
  /**This is a service that holds methods, properties, and state of the /search page. This allows multiple components to talk to the same service elegantly/share the same state */
  private animeService = inject(AnimeService);
  private destroy$ = new Subject<void>();
  
  term$ = new BehaviorSubject('');
  minRating$ = new BehaviorSubject(DEFAULT_MIN_RATING);
  maxRating$ = new BehaviorSubject(DEFAULT_MAX_RATING);
  minYear$ = new BehaviorSubject(DEFAULT_MIN_YEAR);
  maxYear$ = new BehaviorSubject(DEFAULT_MAX_YEAR);
  minEpisodes$ = new BehaviorSubject(DEFAULT_MIN_EPS);
  maxEpisodes$ = new BehaviorSubject(DEFAULT_MAX_EPS);
  isTv$ = new BehaviorSubject(DEFAULT_IS_TV);
  isMovie$ = new BehaviorSubject(DEFAULT_IS_MOVIE);
  sortOption$ = new BehaviorSubject(DEFAULT_SORT_OPTION); //see library component for reference.
  
  private _resultsSubject = new BehaviorSubject<Anime[]>([]);
  results$ = this._resultsSubject.asObservable();
  filteredSearchResults$ = combineLatest([
    this.term$,
    this.minRating$,
    this.maxRating$,
    this.minYear$,
    this.maxYear$,
    this.minEpisodes$,
    this.maxEpisodes$,
    this.isTv$,
    this.isMovie$,
    this.sortOption$
  ]).pipe(
    switchMap(([term, minRating, maxRating, minYear, maxYear, minEps, maxEps, isTv, isMovie, sortOption]) => {   
      return this.animeService
        .searchAnime(term, minYear, maxYear, minRating, maxRating, minEps, maxEps, isTv, isMovie)
        .pipe(map(list => this.sorter(list, sortOption)));
      }
    )
  );

  resetSearchOptions() {
    this.term$.next('');
    this.minRating$.next(DEFAULT_MIN_RATING);
    this.maxRating$.next(DEFAULT_MAX_RATING);
    this.minYear$.next(DEFAULT_MIN_YEAR);
    this.maxYear$.next(DEFAULT_MAX_YEAR);
    this.minEpisodes$.next(DEFAULT_MIN_EPS);
    this.maxEpisodes$.next(DEFAULT_MAX_EPS);
    this.isTv$.next(DEFAULT_IS_TV);
    this.isMovie$.next(DEFAULT_IS_MOVIE);
    this.sortOption$.next(DEFAULT_SORT_OPTION);
  }

  loadSearchResults() {
    this.animeService.searchAnime(
      this.term$.value,
      this.minYear$.value,
      this.maxYear$.value,
      this.minRating$.value,
      this.maxRating$.value,
      this.minEpisodes$.value,
      this.maxEpisodes$.value,
      this.isTv$.value,
      this.isMovie$.value
    ).subscribe((animes) => {
        this._resultsSubject.next(animes);
      })
  }

  private sorter(list: Anime[], column: string): Anime[] {
    const sorted = [...list];

    if (column === "Title") {
      sorted.sort((a, b) => a.title < b.title ? -1 : 1)
    }
    else if (column === "Rating") {
      sorted.sort((a, b) => a.score! < b.score! ? 1 : -1)
    }

    return sorted;
  }
}
