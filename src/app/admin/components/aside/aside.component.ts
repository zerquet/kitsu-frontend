import { AsyncPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'admin-aside',
  standalone: true,
  imports: [NgClass, AsyncPipe, RouterLink],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent {
  tabs = ['Anime', 'Episodes', 'Franchises'];
  @Input() username: string | undefined;
  activeTab = 'Anime';

  onTabClick(tab: string) {
    this.activeTab = tab;
  }
}
