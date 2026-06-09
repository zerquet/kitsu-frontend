import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, distinctUntilChanged, map, tap } from 'rxjs';
import { UsersService } from '../../../../shared/services/users.service';
import { UsersLibraryComponent } from './components/users-library/users-library.component';
import { NavTabsComponent } from '../../../../shared/components/nav-tabs/nav-tabs.component';
import { PrimaryInfoComponent } from './components/primary-info/primary-info.component';
import { UsersAboutComponent } from './components/users-about/users-about.component';
import { CoverPhotoComponent } from '../../../../shared/components/cover-photo/cover-photo.component';
import { environment } from '../../../../../environments/environment';
import { UsersReactionsComponent } from "./components/users-reactions/users-reactions.component";

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

  tabs = ['about', 'library', 'reactions'];
  environment = environment;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (params) => this.usersService.setProfileStateByUserId(params['id'])
      });
  }

  userProfile$ = this.usersService.profile$

  //get rid of activity tab. rename to about. for this project, don't add multi user activity like following
  //keep it a simple media tracker. leave the reddit-like app for another project. 
  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "about"),
    takeUntil(this.destroy$)
  );
}
