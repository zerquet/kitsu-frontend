import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabItem } from '../../../../shared/models/tab-item.model';

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
export class AnimeComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private animeService = inject(AnimeService); //in this component, should not get all animes. create setState methods and call them according to the component
  private userAnimeService = inject(UserAnimeService);
  private modalService = inject(NgbModal);
  private destroyRef = inject(DestroyRef);

  tabs: TabItem[] = [
    {id: 'anime.summary', label: 'summary', routeUrl: '../summary'},
    {id: 'anime.episodes', label: 'episodes', routeUrl: '../episodes'},
    {id: 'anime.characters', label: 'characters', routeUrl: '../characters'},
    {id: 'anime.franchise', label: 'franchise', routeUrl: '../franchise'}
  ];
  environment = environment;
  animeId = 0;
  animeEpisodeCount = 0;
  isLoggedIn = false;

  ngOnInit(): void {
    this.authService.authenticatedUser$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (authenticatedUser) => {
        if (authenticatedUser) this.isLoggedIn = true;
      }
    })
  }

  isFavorite$ = new BehaviorSubject<boolean>(false);

  animeResponse$ = this.route.params.pipe(
    distinctUntilChanged(),
    switchMap(params => this.animeService.getAnimeById(params['id'])),
    tap(res => {
      if (!res) return;

      this.animeId = res.anime.id;
      this.animeEpisodeCount = res.anime.episodeCount ?? 0;

      this.isFavorite$.next(res?.isFavorite);
    }),
    takeUntilDestroyed(this.destroyRef)
  );

  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "summary"),
    takeUntilDestroyed(this.destroyRef)
  );

  onAddToFavorites(anime: Anime) {
    if (!this.isLoggedIn) {
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

  onUnfavorite(animeId: number) {
    this.userAnimeService.deleteFavoriteAnime(animeId)
      .subscribe({
        next: () => this.isFavorite$.next(false)
      });
  }
}
