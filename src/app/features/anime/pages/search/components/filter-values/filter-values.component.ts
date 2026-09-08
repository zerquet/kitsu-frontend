import { Component, Input } from '@angular/core';

@Component({
  selector: 'filter-values',
  standalone: true,
  imports: [],
  templateUrl: './filter-values.component.html',
  styleUrl: './filter-values.component.css'
})
export class FilterValuesComponent {
  @Input() filter: 'Year' | 'Average Rating' | 'Episodes' | 'Types' | '' = '';
  @Input() min: string | undefined;
  @Input() max: string | undefined;
}
