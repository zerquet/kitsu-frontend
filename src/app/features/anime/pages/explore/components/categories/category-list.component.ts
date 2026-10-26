import { Component, inject, Input } from '@angular/core';
import { Category } from '../../../../../../shared/models/category.model';
import { RouterLink } from '@angular/router';
import { CategoriesSkeletonComponent } from '../categories-skeleton/categories-skeleton.component';
import { CategoryService } from '../../../../../../shared/services/category.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [RouterLink, CategoriesSkeletonComponent, AsyncPipe],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  private categoryService = inject(CategoryService);
  categories$ = this.categoryService.currentCategories$;
}
