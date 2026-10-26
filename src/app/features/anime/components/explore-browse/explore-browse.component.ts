import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, tap, switchMap, startWith, delay } from 'rxjs';
import { AnimeService } from '../../../../shared/services/anime.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { AnimeGridComponent } from '../anime-grid/anime-grid.component';
import { ViewMoreLinkComponent } from '../view-more-link/view-more-link.component';
import { AsyncPipe } from '@angular/common';
import { AnimeGridSkeletonComponent } from '../anime-grid-skeleton/anime-grid-skeleton.component';

@Component({
  selector: 'explore-browse',
  standalone: true,
  imports: [AnimeGridComponent, ViewMoreLinkComponent, AsyncPipe, AnimeGridSkeletonComponent],
  templateUrl: './explore-browse.component.html',
  styleUrl: './explore-browse.component.css'
})
export class ExploreBrowseComponent {
  private animeService = inject(AnimeService);
  private destroyRef = inject(DestroyRef);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute)

  category$ = this.categoryService.currentCategory$;
  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    tap((params) => {
      const category = params['category'];
      this.categoryService.setCategory(category);
      this.categoryService.setCollection(undefined);
    }),
    switchMap((params) => {
      return this.animeService.getExploreAnime(params['category'])
        .pipe(startWith(null))
    }),
    takeUntilDestroyed(this.destroyRef)
  );
    //sub to route again, conditional on :category, returns same dto shape
    //set current category to conditionally update caption and router links too
}
