import { AsyncPipe } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Anime, AnimeDetail } from '../../../../../../shared/models/anime.model';
import { AnimeService } from '../../../../../../shared/services/anime.service';
import { AnimeTooltipComponent } from '../../../../components/anime-tooltip/anime-tooltip.component';
import { environment } from '../../../../../../../environments/environment';

@Component({
  selector: 'anime-franchise',
  standalone: true,
  imports: [AsyncPipe, RouterLink, AnimeTooltipComponent],
  templateUrl: './anime-franchise.component.html',
  styleUrl: './anime-franchise.component.css'
})
export class AnimeFranchiseComponent {
  private animeService = inject(AnimeService);
  animes$ = new BehaviorSubject<AnimeDetail[]>([]); //TODO make into observable?
  @Input() franchiseName: string = "";
  @Input() set id(id: number | undefined) {
    if (id != null) {
      this.animeService.getAnimesByFranchiseId(id).subscribe(animes => {
        this.animes$.next(animes);
      });
    }
  }
  activeAnimeId = 0;
  showTooltipCallback: any;
  environment = environment

  onAnimePosterHover(id: number): void {
    this.showTooltipCallback = setTimeout(() => {
      this.activeAnimeId = id;
    }, 300);
  }

  onAnimePosterHoverOut(): void {
    if (this.showTooltipCallback) {
      clearTimeout(this.showTooltipCallback);
      this.activeAnimeId = 0;
    }
  }
}
