import { Component, Input } from '@angular/core';
import { Category } from '../../../../../../shared/models/category.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'category-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  @Input() categories: Category[] = [];
}
