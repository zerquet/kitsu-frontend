import { AfterContentChecked, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { CategoryService } from '../../../../shared/services/category.service';
import { CommonModule } from '@angular/common';
import { CategoryListComponent } from './components/categories/category-list.component';
import { CategorySummaryComponent } from './components/category-summary/category-summary.component';
import { MainSearchComponent } from "./components/main-search/main-search.component";

@Component({
  selector: 'anime-explore',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryListComponent,
    CategorySummaryComponent,
    MainSearchComponent,
    RouterOutlet
],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements AfterContentChecked {
  private categoryService = inject(CategoryService);
  private cdref = inject(ChangeDetectorRef);

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  categories$ = this.categoryService.getCategories();
}
