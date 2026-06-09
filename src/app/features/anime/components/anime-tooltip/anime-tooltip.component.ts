import { Component, Input } from '@angular/core';
import { Anime } from '../../../../shared/models/anime.model';

@Component({
  selector: 'anime-card-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './anime-tooltip.component.html',
  styleUrl: './anime-tooltip.component.css'
})
export class AnimeTooltipComponent {
  @Input() anime: Anime | undefined;
}
