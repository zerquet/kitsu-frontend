import { Component, Input } from '@angular/core';

@Component({
  selector: 'table-row-skeleton',
  standalone: true,
  imports: [],
  templateUrl: './table-row-skeleton.component.html',
  styleUrl: './table-row-skeleton.component.css'
})
export class TableRowSkeletonComponent {
  @Input() count = 4;

  get placeholders(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
