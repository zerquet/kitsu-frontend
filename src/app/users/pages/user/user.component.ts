import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, switchMap, takeUntil, distinctUntilChanged, map, tap } from 'rxjs';
import { UsersService } from '../../../shared/services/users.service';
import { LibraryComponent } from '../../components/library/library.component';
import { NavTabsComponent } from '../../../shared/components/nav-tabs/nav-tabs.component';
import { PrimaryInfoComponent } from '../../components/primary-info/primary-info.component';
import { UserAboutComponent } from '../../components/user-about/user-about.component';
import { CoverPhotoComponent } from '../../../shared/components/cover-photo/cover-photo.component';
import { environment } from '../../../../environments/environment';
import { ReactionsComponent } from "../../components/reactions/reactions.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    LibraryComponent,
    AsyncPipe,
    NavTabsComponent,
    PrimaryInfoComponent,
    UserAboutComponent,
    CoverPhotoComponent,
    ReactionsComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);

  tabs = ['about', 'library', 'reactions'];
  environment = environment;

  private destroy$ = new Subject<void>();
  
  userProfile$ = this.route.params.pipe(
    switchMap(params => this.usersService.fetchProfileById(params['id'])), //pass params to library as well so it updates?
    tap((userProfile) => this.usersService.setProfileState(userProfile)),
    takeUntil(this.destroy$)
  );
  //get rid of activity tab. rename to about. for this project, don't add multi user activity like following
  //keep it a simple media tracker. leave the reddit-like app for another project. 
  currentTab$ = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "about"),
    takeUntil(this.destroy$)
  );
}
