import { Component, Input } from '@angular/core';

@Component({
  selector: 'categories-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './categories-skeleton.component.html',
  styleUrl: './categories-skeleton.component.css'
})
export class CategoriesSkeletonComponent {
  @Input() count = 30;

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
