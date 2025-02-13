import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { FilterValuesComponent } from '../filter-values/filter-values.component';
import { FilterLegendComponent } from '../filter-legend/filter-legend.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, filter } from 'rxjs';

@Component({
  selector: 'filter-options',
  standalone: true,
  imports: [ReactiveFormsModule, MatSliderModule, FilterValuesComponent, FilterLegendComponent],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.css',
  providers: [{provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: true}}]
})
export class FilterOptionsComponent {
  @Output() filtersChange = new EventEmitter<
  {
    value: string, 
    filter: 'minYear$' | 'maxYear$' | 'minRating$' | 'maxRating$' | 'minEpisodes$' | 'maxEpisodes$'
  }>();

  @Output() mediaTypesChange = new EventEmitter<'isMovie$' | 'isTv$'>();

  minRatingPillValue = '5';
  maxRatingPillValue = '100';
  minYearPillValue = '1975';
  maxYearPillValue = '2025';
  minEpisodesPillValue = '1';
  maxEpisodesPillValue = '100';
  
  tvChecked$ = new BehaviorSubject(false);
  movieChecked$ = new BehaviorSubject(false);

  onSliderInput = (
    event: Event, 
    control: 
    'minYearPillValue' 
    | 'maxYearPillValue' 
    | 'minRatingPillValue' 
    | 'maxRatingPillValue' 
    | 'minEpisodesPillValue' 
    | 'maxEpisodesPillValue'
  ) => this[control] = (event.target as HTMLInputElement).value;
  
  onSliderChange = (
    event: Event, 
    control: 
    'minYear$' | 'maxYear$' | 'minRating$' | 'maxRating$' | 'minEpisodes$' | 'maxEpisodes$'
  ) => 
    this.filtersChange.emit({
      value: (event.target as HTMLInputElement).value, 
      filter: control
    })
    
  onToggleMediaType = (control: 'isMovie$' | 'isTv$') => this.mediaTypesChange.emit(control);
}
