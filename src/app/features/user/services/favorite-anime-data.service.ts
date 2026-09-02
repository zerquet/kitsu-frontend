import { DestroyRef, inject, Injectable, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../shared/services/user-anime.service';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { FavoriteAnime } from '../../../shared/models/favoriteAnime.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class FavoriteAnimeDataService {
  private userAnimeService = inject(UserAnimeService);
  private destroyRef = inject(DestroyRef);
  pendingList$ = new BehaviorSubject<FavoriteAnime[]>([]);
  sourceList$ = this.userAnimeService.favoriteAnimes$;
  favoritesChanged$ = combineLatest([
    this.pendingList$, 
    this.sourceList$]
  ).pipe(
    map(([pendingList, sourceList]) => {
      if (pendingList.length !== sourceList.length) return true;

      const pending = pendingList.map(f => f.animeId).sort();
      const source = sourceList.map(f => f.animeId).sort();

      let isDifferent = false;
      for (let i = 0; i < pending.length; i++) {
        if (pending[i] !== source[i]) {
          isDifferent = true;
          break;
        }
      }

      return isDifferent;
    })
  )
  
  constructor() {
    this.loadData();
  }

  private loadData() {
    this.userAnimeService.favoriteAnimes$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (favorites) => {
          this.pendingList$.next([...favorites])
        }
      });
  }

  add(newFavorite: FavoriteAnime) {
    this.pendingList$.next([...this.pendingList$.getValue(), newFavorite])
  }

  exists(animeId: number) {
    const list = this.pendingList$.getValue();
    const idx = list.findIndex(a => a.animeId === animeId);
    return list.includes(list[idx]);  
  }
  
  remove(animeId: number) {
    this.pendingList$.next(this.pendingList$.getValue().filter(a => a.animeId !== animeId));
  }

  resetState() {
    this.loadData();
  }

  commit() {
    return this.userAnimeService.updateFavoriteAnimes(this.pendingList$.getValue());
  }
}
