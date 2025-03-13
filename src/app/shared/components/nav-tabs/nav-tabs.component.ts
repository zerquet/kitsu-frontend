import { NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'nav-tabs',
  standalone: true,
  imports: [NgClass, RouterLink, TitleCasePipe],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.css'
})
export class NavTabsComponent {
  @Input() tabs: string[] = [];
  @Input() resourceId: number | undefined;
  @Input() scootRight: boolean = false;
  selectedTab = this.tabs[0];

  constructor() {
  }
}
