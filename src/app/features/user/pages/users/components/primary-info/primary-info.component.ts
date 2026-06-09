import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../../../../../features/auth/services/auth.service';
import { UserProfile } from '../../../../../../shared/models/userProfile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';
import { UsersService } from '../../../../../../shared/services/users.service';

@Component({
  selector: 'primary-info',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './primary-info.component.html',
  styleUrl: './primary-info.component.css'
})
export class PrimaryInfoComponent {
  authService = inject(AuthService);
  userService = inject(UserAnimeService);
  modalService = inject(NgbModal);
  private usersService = inject(UsersService);
  //@Input() userProfile: UserProfile | undefined;
  environment = environment;

  userProfile$ = this.usersService.profile$;

  canEdit$ = this.usersService.canEdit$;

  onEditProfileClick() {
    const modal = this.modalService.open(EditProfileModalComponent);
    modal.componentInstance.initializeModalData();
    //set input() to open to a tab
  }
}
