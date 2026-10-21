import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { distinctUntilChanged, tap, switchMap } from 'rxjs';
import { AnimeService } from '../../../../shared/services/anime.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { AnimeGridComponent } from '../anime-grid/anime-grid.component';
import { ViewMoreLinkComponent } from '../view-more-link/view-more-link.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'explore-browse',
  standalone: true,
  imports: [AnimeGridComponent, ViewMoreLinkComponent, AsyncPipe],
  templateUrl: './explore-browse.component.html',
  styleUrl: './explore-browse.component.css'
})
export class ExploreBrowseComponent {
  private animeService = inject(AnimeService);
  private destroyRef = inject(DestroyRef);
  private categoryService = inject(CategoryService);

  animes$ = this.animeService.getExploreAnime()
    .pipe(
      tap(() => this.categoryService.changeCurrentCategorySummary()),
      takeUntilDestroyed(this.destroyRef)
    );
}
