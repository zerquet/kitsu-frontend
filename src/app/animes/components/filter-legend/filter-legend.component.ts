import { Component, Input } from '@angular/core';

@Component({
  selector: 'filter-legend',
  standalone: true,
  imports: [],
  template: `<small>{{min}}</small><small>{{max}}</small>`,
  styles: `
    :host {
      display: flex !important;
      justify-content: space-between !important;
      font-weight: 900;
    }`
})
export class FilterLegendComponent {
  @Input() min: string | undefined;
  @Input() max: string | undefined;
}
