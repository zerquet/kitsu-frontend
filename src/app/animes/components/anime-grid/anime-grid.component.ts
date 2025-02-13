import { Component, Input } from '@angular/core';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeCardComponent } from '../anime-card/anime-card.component';

@Component({
  selector: 'anime-grid',
  standalone: true,
  imports: [AnimeCardComponent],
  templateUrl: './anime-grid.component.html',
  styleUrl: './anime-grid.component.css'
})
export class AnimeGridComponent {
  @Input() animes: Anime[] = [];
  @Input() showCardTitle: boolean = false;
  @Input() showGreeting: boolean = false;
}
