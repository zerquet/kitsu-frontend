import { NgClass, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'nav-tabs',
  standalone: true,
  imports: [NgClass, RouterLink, TitleCasePipe],
  templateUrl: './nav-tabs.component.html',
  styleUrl: './nav-tabs.component.css'
})
export class NavTabsComponent implements OnDestroy {
  private route = inject(ActivatedRoute);
  
  @Input() tabs: string[] = [];
  @Input() resourceId: number | undefined;
  @Input() scootRight: boolean = false;
  selectedTab = this.tabs[0];

  private destroy$ = new Subject<void>();

  constructor() {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => this.selectedTab = params['tab'])
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
