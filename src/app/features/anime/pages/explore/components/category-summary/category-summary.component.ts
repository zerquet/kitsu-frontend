import { Component, inject, Input } from '@angular/core';
import { Category } from '../../../../../../shared/models/category.model';
import { CategoryService } from '../../../../../../shared/services/category.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'category-summary',
  standalone: true,
  imports: [AsyncPipe],
  template: `
  @if (this.summary$ | async; as summary) {
    <h3 class="pt-5">
      <span>{{summary}}</span>
    </h3>
  }
  `,
  styles: ``
})
export class CategorySummaryComponent {
  private categoryService = inject(CategoryService);
  summary$ = this.categoryService.currentCategorySummary$;
}
