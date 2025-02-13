import { Component, Input } from '@angular/core';
import { AnimeFranchiseComponent } from "../anime-franchise/anime-franchise.component";
import { AnimeEpisodesComponent } from "../anime-episodes/anime-episodes.component";
import { AnimeSummaryComponent } from "../anime-summary/anime-summary.component";
import { Anime } from '../../../shared/models/anime.model';

@Component({
  selector: 'anime-container',
  standalone: true,
  imports: [AnimeFranchiseComponent, AnimeEpisodesComponent, AnimeSummaryComponent],
  templateUrl: './anime-container.component.html',
  styleUrl: './anime-container.component.css'
})
export class AnimeContainerComponent {
  @Input() tab: string | undefined;
  @Input() anime: Anime | undefined;
}
