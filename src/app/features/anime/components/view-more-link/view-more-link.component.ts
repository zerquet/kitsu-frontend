import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'view-more-link',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './view-more-link.component.html',
  styleUrl: './view-more-link.component.css'
})
export class ViewMoreLinkComponent {
  @Input() routerLink: string | undefined = '/explore'; 
}
