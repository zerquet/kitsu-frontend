import { Component, Input } from '@angular/core';
import { Category } from '../../../shared/models/category.model';

@Component({
  selector: 'category-summary',
  standalone: true,
  imports: [],
  template: `
  <h3 class="pt-5">
    <span>{{category.name}}</span>
    Anime
  </h3>
  `,
  styles: ``
})
export class CategorySummaryComponent {
  @Input() category!: Category;
}
