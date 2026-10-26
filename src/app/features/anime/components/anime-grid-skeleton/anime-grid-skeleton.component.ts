import { Component, Input } from '@angular/core';

@Component({
  selector: 'anime-grid-skeleton',
  standalone: true,
  templateUrl: './anime-grid-skeleton.component.html',
  styleUrl: './anime-grid-skeleton.component.css'
})
export class AnimeGridSkeletonComponent {
  @Input() count: number = 18;
  @Input() showCardTitle: boolean = false;
  @Input() showCaption: boolean = false;

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
