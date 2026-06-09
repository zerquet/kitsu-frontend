import { AfterContentChecked, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, Observable, BehaviorSubject, distinctUntilChanged, switchMap, of, takeUntil, combineLatest, map, debounceTime, tap, withLatestFrom, startWith } from 'rxjs';
import { Anime } from '../../../../shared/models/anime.model';
import { Category } from '../../../../shared/models/category.model';
import { AnimeService } from '../../../../shared/services/anime.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent } from '../../../../shared/components/search-results/search-results.component';
import { AnimeTooltipComponent } from '../../components/anime-tooltip/anime-tooltip.component';
import { AnimeCardComponent } from '../../components/anime-card/anime-card.component';
import { AnimeGridComponent } from '../../components/anime-grid/anime-grid.component';
import { CategoryListComponent } from './components/categories/category-list.component';
import { CategorySummaryComponent } from './components/category-summary/category-summary.component';
import { MainSearchComponent } from "./components/main-search/main-search.component";

@Component({
  selector: 'anime-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AnimeGridComponent,
    CategoryListComponent,
    CategorySummaryComponent,
    MainSearchComponent
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnDestroy, AfterContentChecked {
  private animeService = inject(AnimeService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private cdref = inject(ChangeDetectorRef);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  private destroy$ = new Subject<void>();
  categories$ = this.categoryService.getCategories();
  category$ = this.categoryService.getCategory('');

  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    tap((params) => {
      if (params['category'])
        this.category$ = this.categoryService.getCategory(params['category']);
    }),
    switchMap((params) => {
      if (params['category'])
        return this.animeService.getAnimesByCategory(params['category']);
      else
        return this.animeService.getAnimes();
    }),
    takeUntil(this.destroy$)
  );

}
