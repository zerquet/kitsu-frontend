import { Component, inject } from '@angular/core';
import { AdvancedSearchDataService } from '../../../../services/advanced-search-data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sort-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sort-dropdown.component.html',
  styleUrl: './sort-dropdown.component.css'
})
export class SortDropdownComponent {
  dataService = inject(AdvancedSearchDataService);
  selectedOption = this.dataService.sortOption$;
  changeSortOption = (option: string) => this.dataService.sortOption$.next(option);
}
