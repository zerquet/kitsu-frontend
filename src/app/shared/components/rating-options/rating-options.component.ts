import { Component, EventEmitter, Output, output, TemplateRef, ViewChild } from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { RATING_OPTIONS } from '../../constants/constants';

@Component({
  selector: 'rating-options',
  standalone: true,
  imports: [NgbTooltip],
  template: `
  <ng-template #ratingOptionsTemplate>
    <div id="rating-options-container">
      @for (ratingOption of ratingOptions; track ratingOption) {
        <div 
          class="rating-option" 
          [ngbTooltip]="ratingOption.ratingLabel" 
          placement="top" [openDelay]="100" [closeDelay]="75" 
          (click)="ratingSelected.emit(ratingOption.userRating)"
        >
          <i [class]="ratingOption.iconClass + ' ' + ratingOption.colorClass"></i>
        </div>
      }
    </div>
  </ng-template>
  `,
  styleUrl: './rating-options.component.css'
})
export class RatingOptionsComponent {
  @ViewChild('ratingOptionsTemplate', { static: true }) template!: TemplateRef<unknown>;
  @Output() ratingSelected = new EventEmitter<number>();
  ratingOptions = RATING_OPTIONS;
}
