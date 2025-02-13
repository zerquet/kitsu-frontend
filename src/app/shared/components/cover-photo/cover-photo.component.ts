import { Component, Input } from '@angular/core';

@Component({
  selector: 'cover-photo',
  standalone: true,
  imports: [],
  template: `<div style='background: url({{coverPhotoUrl}})'></div>`,
  styleUrl: './cover-photo.component.css'
})
export class CoverPhotoComponent {
  @Input() coverPhotoUrl: string  = 'https://kitsu.app/images/default_cover-22e5f56b17aeced6dc7f69c8d422a1ab.png';
}
