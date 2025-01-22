import { AfterContentChecked, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Observable, BehaviorSubject, distinctUntilChanged, switchMap, of, takeUntil, combineLatest, map, debounceTime, tap, withLatestFrom, startWith } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { Category } from '../../../shared/models/category.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { CategoryService } from '../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { AnimeTooltipComponent } from '../../components/anime-tooltip/anime-tooltip.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, SearchResultsComponent, AnimeTooltipComponent],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit, OnDestroy, AfterContentChecked  {
  private destroy$ = new Subject<void>();
  private animeService = inject(AnimeService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private cdref = inject(ChangeDetectorRef);

  activeAnimeId = 0;
  show = false;
  showTooltipCallback: any;
  form = new FormGroup({ searchControl: new FormControl() });
  
  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(term => {
        if(term && term.trim().length > 0)
          this.show = true;
        else 
        this.show = false;
    }),
    takeUntil(this.destroy$))
    .subscribe(term => this.term$.next(term));
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentChecked(): void {
      this.cdref.detectChanges();
  }
  
  term$ = new BehaviorSubject<string>("");
  categories$ = this.categoryService.getCategories();
  category$ = this.categoryService.getCategory('');
  
  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    tap((params) => {
      if(params['category'])
        this.category$ = this.categoryService.getCategory(params['category']);
    }),
    switchMap((params) => {
      if(params['category'])
        return this.animeService.getAnimesByCategory(params['category']);
      else
        return this.animeService.getAnimes();
    }),
    takeUntil(this.destroy$)
  );
  //why cant i just use this.term$ here? why do i need to use combineLatest? this.term$ just returns the first char
  searchResults$ = combineLatest([this.term$]).pipe(
    map(([term]) => term),
    switchMap(term => this.search(term)),
    takeUntil(this.destroy$));

  private search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
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
