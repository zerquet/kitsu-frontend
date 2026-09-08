import { NgClass, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TabItem } from '../../models/tab-item.model';

@Component({
  selector: 'nav-tabs',
  standalone: true,
  imports: [NgClass, RouterLink, TitleCasePipe, RouterLinkActive],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.css'
})
export class NavTabsComponent {  
  @Input() tabs: TabItem[] = [];
  @Input() scootRight: boolean = false;
  @Input() hasBottomBorder: boolean = true;
  @Output() tabClicked = new EventEmitter<string>();
  @Input() activeTabId?: string;
}
