import { Component, Input } from '@angular/core';
import { Anime } from '../../../../shared/models/anime.model';
import { RouterLink } from '@angular/router';
import { AnimeTooltipComponent } from '../anime-tooltip/anime-tooltip.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'anime-card',
  standalone: true,
  imports: [RouterLink, AnimeTooltipComponent],
  templateUrl: './anime-card.component.html',
  styleUrl: './anime-card.component.css'
})
export class AnimeCardComponent {
  @Input() anime: Anime | undefined;
  @Input() showCardTitle: boolean = false;
  showTooltipCallback: any;
  showTooltip: boolean = false;
  environment = environment;

  onAnimePosterHover(): void {
    this.showTooltipCallback = setTimeout(() => {
      this.showTooltip = true;
    }, 300);
  }

  onAnimePosterHoverOut(): void {
    if (this.showTooltipCallback) {
      clearTimeout(this.showTooltipCallback);
      this.showTooltip = false;
    }
  }
}
