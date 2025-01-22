import { Component, inject, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AnimeTooltipComponent } from '../../components/anime-tooltip/anime-tooltip.component';
import { MatSliderModule } from '@angular/material/slider';
import { MAT_RIPPLE_GLOBAL_OPTIONS, MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatSliderModule, AnimeTooltipComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  providers: [{provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}}]
})
export class SearchComponent implements OnDestroy {
  private destroy$ = new Subject<void>();
  private animeService = inject(AnimeService);
  activeAnimeId = 0;
  showTooltipCallback: any;
  minRatingPillValue = "5";
  maxRatingPillValue = "100";
  minYearPillValue = "1975";
  maxYearPillValue = "2025";
  minEpisodesPillValue = "1";
  maxEpisodesPillValue = "100";
  form = new FormGroup({ searchControl: new FormControl() });
  minRating$ = new BehaviorSubject("5");
  maxRating$ = new BehaviorSubject("100");
  minYear$ = new BehaviorSubject("1975");
  maxYear$ = new BehaviorSubject("2025");
  minEpisodes$ = new BehaviorSubject("1");
  maxEpisodes$ = new BehaviorSubject("100");
  term$ = new BehaviorSubject("");
  tvChecked$ = new BehaviorSubject(false);
  movieChecked$ = new BehaviorSubject(false);
  results$: Observable<Anime[]> = combineLatest([
    this.minRating$,
    this.maxRating$,
    this.minYear$,
    this.maxYear$,
    this.minEpisodes$,
    this.maxEpisodes$,
    this.tvChecked$,
    this.movieChecked$,
    this.term$
  ]).pipe(
    switchMap(() => this.getAdvancedResults()),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {
    this.form.controls["searchControl"].valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntil(this.destroy$))
      .subscribe(term => this.term$.next(term.toLowerCase())); //tried putting valueChanges in combineLatest, but didn't work. so im subscribing to update the term observable.
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateMinYearPillValue = (event: Event) => this.minYearPillValue = (event.target as HTMLInputElement).value;

  updateMaxYearPillValue = (event: Event) => this.maxYearPillValue = (event.target as HTMLInputElement).value;

  updateMinRatingPillValue = (event: Event) => this.minRatingPillValue = (event.target as HTMLInputElement).value;

  updateMaxRatingPillValue = (event: Event) => this.maxRatingPillValue = (event.target as HTMLInputElement).value;

  updateMinEpisodesPillValue = (event: Event) => this.minEpisodesPillValue = (event.target as HTMLInputElement).value;

  updateMaxEpisodesPillValue = (event: Event) => this.maxEpisodesPillValue = (event.target as HTMLInputElement).value;

  //One method. Pass name of variable. Use array index notation (e.g. this["minRating"]) and reduce duplication. Methods 6 down to 1.
  getMinRating = (event: Event) => this.minRating$.next((event.target as HTMLInputElement).value);

  getMaxRating = (event: Event) => this.maxRating$.next((event.target as HTMLInputElement).value);
  
  getMinYear = (event: Event) => this.minYear$.next((event.target as HTMLInputElement).value)

  getMaxYear = (event: Event) => this.maxYear$.next((event.target as HTMLInputElement).value);

  getMinEpisodes = (event: Event) => this.minEpisodes$.next((event.target as HTMLInputElement).value);

  getMaxEpisodes = (event: Event) => this.maxEpisodes$.next((event.target as HTMLInputElement).value);

  toggleTv = () => this.tvChecked$.next(!this.tvChecked$.value);
  
  toggleMovie = () => this.movieChecked$.next(!this.movieChecked$.value);
  
  private getAdvancedResults(): Observable<Anime[]> {
    return this.animeService
      .advancedSearch(
        this.term$.value, 
        this.minYear$.value, 
        this.maxYear$.value, 
        this.minRating$.value, 
        this.maxRating$.value, 
        this.minEpisodes$.value, 
        this.maxEpisodes$.value, 
        this.tvChecked$.value, 
        this.movieChecked$.value);
  }

  onAnimePosterHover(id: number): void {
    this.showTooltipCallback = setTimeout(() => {
      this.activeAnimeId = id;
    }, 300);
  }

  onAnimePosterHoverOut(): void {
    if(this.showTooltipCallback) {
      clearTimeout(this.showTooltipCallback);
      this.activeAnimeId = 0;
    }
  }
}
