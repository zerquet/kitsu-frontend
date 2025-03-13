import { Component, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdvancedSearchDataService } from '../../services/advanced-search-data.service';

@Component({
  selector: 'sort-dropdown',
  standalone: true,
  imports: [],
  templateUrl: './sort-dropdown.component.html',
  styleUrl: './sort-dropdown.component.css'
})
export class SortDropdownComponent {
  dataService = inject(AdvancedSearchDataService);
  changeSortOption = (option: string) => this.dataService.sortOption$.next(option);
}
