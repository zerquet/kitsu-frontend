import { Component, inject, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Subject, BehaviorSubject, Observable, combineLatest, switchMap, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { CommonModule } from '@angular/common';
import { AnimeGridComponent } from '../../components/anime-grid/anime-grid.component';
import { AdvancedSearchComponent } from '../../components/advanced-search/advanced-search.component';
import { FilterOptionsComponent } from '../../components/filter-options/filter-options.component';
import { SortDropdownComponent } from '../../components/sort-dropdown/sort-dropdown.component';
import { AdvancedSearchDataService } from '../../services/advanced-search-data.service';

@Component({
  selector: 'search',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FilterOptionsComponent,
    AnimeGridComponent,
    AdvancedSearchComponent,
    SortDropdownComponent
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  dataService$ = inject(AdvancedSearchDataService);

  onFormChange = (term: string) => this.dataService$.term$.next(term);

  onFiltersChange = (
    prop: {
      value: string, 
      filter: 'minYear$' | 'maxYear$' | 'minRating$' | 'maxRating$' | 'minEpisodes$' | 'maxEpisodes$'
    }
  ) => this.dataService$[prop.filter].next(prop.value);

  onMediaTypesChange = (filter: 'isTv$' | 'isMovie$') => this.dataService$[filter].next(!this.dataService$[filter].getValue())
  
}
