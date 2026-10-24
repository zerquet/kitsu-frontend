import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, tap, switchMap } from 'rxjs';
import { AnimeService } from '../../../../shared/services/anime.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { AnimeGridComponent } from '../anime-grid/anime-grid.component';
import { AsyncPipe } from '@angular/common';
import { COLLECTION_SUMMARIES, isCollectionKey } from '../../../../shared/constants/constants';

@Component({
  selector: 'explore-collection',
  standalone: true,
  imports: [AnimeGridComponent, AsyncPipe],
  templateUrl: './explore-collection.component.html',
  styleUrl: './explore-collection.component.css'
})
export class ExploreCollectionComponent {
  private animeService = inject(AnimeService);
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  
  animes$ = this.route.params.pipe(
    distinctUntilChanged(),
    tap(({ collection, category }) => {
      this.categoryService.setCategory(category);
      this.categoryService.setCollection(isCollectionKey(collection) ? COLLECTION_SUMMARIES[collection] : undefined);
    }),
    switchMap((params) => {
        return this.animeService.getExploreAnimeByCollection(params['collection'], params['category']);
    }),
    takeUntilDestroyed(this.destroyRef)
  );
}
