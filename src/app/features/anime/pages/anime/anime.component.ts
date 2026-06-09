import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject, distinctUntilChanged, takeUntil, map, switchMap, tap } from 'rxjs';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { Anime } from '../../../../shared/models/anime.model';
import { AnimeService } from '../../../../shared/services/anime.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../../../../features/auth/register/register.component';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs/nav-tabs.component';
import { AnimeContainerComponent } from './components/anime-container/anime-container.component';
import { CoverPhotoComponent } from "../../../../shared/components/cover-photo/cover-photo.component";
import { environment } from '../../../../../environments/environment';
import { LibraryEntryStatusComponent } from "./components/library-entry-status/library-entry-status.component";

@Component({
  selector: 'anime',
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    ReactiveFormsModule,
    NavTabsComponent,
    AnimeContainerComponent,
    CoverPhotoComponent,
    LibraryEntryStatusComponent
  ],
  templateUrl: './anime.component.html',
  styleUrl: './anime.component.css'
})
export class AnimeComponent implements OnDestroy {
  public authService = inject(AuthService);

  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService); //in this component, should not get all animes. create setState methods and call them according to the component
  private userAnimeService = inject(UserAnimeService);
  private modalService = inject(NgbModal);

  tabs = ['summary', 'episodes', 'characters', 'franchise'];
  environment = environment;
  animeId = 0;
  animeEpisodeCount = 0;

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  isFavorite$ = new BehaviorSubject<boolean>(false);

  animeResponse$ = this.route.params.pipe(
    distinctUntilChanged(),
    switchMap(params => this.animeService.getAnimeById(params['id'])),
    tap(res => {
      if (!res)
        return;

      this.animeId = res.anime.id;
      this.animeEpisodeCount = res.anime.episodeCount ?? 0;

      this.isFavorite$.next(res?.isFavorite);
    }),
    takeUntil(this.destroy$)
  );

  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "summary"),
    takeUntil(this.destroy$)
  );

  onAddToFavoritesClick(anime: Anime) {
    if (this.authService.authenticatedUser$.getValue() === null) {
      const signUpModalRef = this.modalService.open(RegisterComponent)
      signUpModalRef.componentInstance.name = "Sign In";
    }
    else {
      this.userAnimeService.addFavoriteAnime(anime.id)
        .subscribe({
          next: () => this.isFavorite$.next(true)
        });
    }
  }

  onUnfavoriteClick(animeId: number) {
    this.userAnimeService.deleteFavoriteAnime(animeId)
      .subscribe({
        next: () => this.isFavorite$.next(false)
      });
  }
}
