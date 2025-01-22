import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Subject, Observable, switchMap, takeUntil, distinctUntilChanged, map, tap } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UsersService } from '../../../shared/services/users.service';
import { LibraryComponent } from '../../components/library/library.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { EditProfileComponent } from '../../components/edit-profile/edit-profile.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [LibraryComponent, NgIf, AsyncPipe, NgClass, RouterLink],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  public authService = inject(AuthService);

  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private modalService = inject(NgbModal)

  private destroy$ = new Subject<void>();
  
  userProfile$: Observable<UserProfile> = this.route.params.pipe(
    switchMap(params => this.usersService.getUserProfileById(params['id'])),
    tap((userProfile) => this.usersService.setUserProfileState(userProfile)),
    takeUntil(this.destroy$)
  );

  currentTab$: Observable<string> = this.route.params.pipe(
    distinctUntilChanged(),
    map(params => params['tab'] || "activity"),
    takeUntil(this.destroy$)
  );

  onEditProfileClick(profileInfo: UserProfile) {
    const modal = this.modalService.open(EditProfileComponent);
    modal.componentInstance.initializeModalData({...profileInfo});
  }
}
