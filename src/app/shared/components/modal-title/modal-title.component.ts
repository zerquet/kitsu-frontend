import { Component, Input } from '@angular/core';

@Component({
  selector: 'modal-title',
  standalone: true,
  imports: [],
  template: `<div><h4 class="modal-title">{{title}}</h4></div>`,
  styles: `
  .modal-title {
      font-weight: 600;
  }`
})
export class ModalTitleComponent {
  @Input() title: string = 'No title';
}
