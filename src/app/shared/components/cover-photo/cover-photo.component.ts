import { Component, Input } from '@angular/core';

@Component({
  selector: 'cover-photo',
  standalone: true,
  imports: [],
  template: `<div style='background: url({{coverPhotoUrl}})'></div>`,
  styleUrl: './cover-photo.component.css'
})
export class CoverPhotoComponent {
  @Input() coverPhotoUrl?: string;
}
