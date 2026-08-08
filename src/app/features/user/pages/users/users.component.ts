import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, distinctUntilChanged, map, tap } from 'rxjs';
import { UsersLibraryComponent } from './components/users-library/users-library.component';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs/nav-tabs.component';
import { PrimaryInfoComponent } from './components/primary-info/primary-info.component';
import { UsersAboutComponent } from './components/users-about/users-about.component';
import { CoverPhotoComponent } from '../../../../shared/components/cover-photo/cover-photo.component';
import { environment } from '../../../../../environments/environment';
import { UsersReactionsComponent } from "./components/users-reactions/users-reactions.component";
import { UsersService } from '../../../../shared/services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TabItem } from '../../../../shared/models/tab-item.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    UsersLibraryComponent,
    AsyncPipe,
    NavTabsComponent,
    PrimaryInfoComponent,
    UsersAboutComponent,
    CoverPhotoComponent,
    UsersReactionsComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  tabs: TabItem[] = [
    {id: 'user.about', label: 'about', routeUrl: '../about'},
    {id: 'user.library', label: 'library', routeUrl: '../library'},
    {id: 'user.reactions', label: 'reactions', routeUrl: '../reactions'}
  ]
  environment = environment;

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (params) => this.usersService.loadProfile(params['id'])
      });
  }

  userProfile$ = this.usersService.profile$

  //get rid of activity tab. rename to about. for this project, don't add multi user activity like following
  //keep it a simple media tracker. leave the reddit-like app for another project. 
  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "about"),
    takeUntilDestroyed(this.destroyRef)
  );
}
