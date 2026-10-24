import { Component, Input } from '@angular/core';
import { AnimeFranchiseComponent } from "../../../../pages/anime/components/anime-franchise/anime-franchise.component";
import { AnimeEpisodesComponent } from "../../../../pages/anime/components/anime-episodes/anime-episodes.component";
import { AnimeSummaryComponent } from "../../../../pages/anime/components/anime-summary/anime-summary.component";
import { Anime, AnimeDetail } from '../../../../../../shared/models/anime.model';

@Component({
  selector: 'anime-container',
  standalone: true,
  imports: [AnimeFranchiseComponent, AnimeEpisodesComponent, AnimeSummaryComponent],
  templateUrl: './anime-container.component.html',
  styleUrl: './anime-container.component.css'
})
export class AnimeContainerComponent {
  @Input() tab: string | undefined;
  @Input() anime: AnimeDetail | undefined;
}
