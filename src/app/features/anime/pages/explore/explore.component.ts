import { AfterContentChecked, ChangeDetectorRef, Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, distinctUntilChanged, switchMap, of, takeUntil, combineLatest, map, debounceTime, tap, withLatestFrom, startWith } from 'rxjs';
import { AnimeService } from '../../../../shared/services/anime.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { AnimeGridComponent } from '../../components/anime-grid/anime-grid.component';
import { CategoryListComponent } from './components/categories/category-list.component';
import { CategorySummaryComponent } from './components/category-summary/category-summary.component';
import { MainSearchComponent } from "./components/main-search/main-search.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ViewMoreLinkComponent } from '../../components/view-more-link/view-more-link.component';

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
    MainSearchComponent,
    ViewMoreLinkComponent
],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements AfterContentChecked {
  private animeService = inject(AnimeService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private cdref = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  categories$ = this.categoryService.getCategories();
  category$ = this.categoryService.getCategory('');

  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    tap((params) => {
      if (params['category'])
        this.category$ = this.categoryService.getCategory(params['category']);
    }),
    switchMap((params) => {
      // if (params['category'])
      //   return this.animeService.getAnimesByCategory(params['category']);
      // else
        return this.animeService.getExploreAnime();
    }),
    takeUntilDestroyed(this.destroyRef)
  );

}
