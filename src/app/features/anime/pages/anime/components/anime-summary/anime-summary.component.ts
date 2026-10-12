import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Anime, AnimeDetail } from '../../../../../../shared/models/anime.model';

@Component({
  selector: 'anime-summary',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './anime-summary.component.html',
  styleUrl: './anime-summary.component.css'
})
export class AnimeSummaryComponent {
  @Input() anime!: AnimeDetail;

}
