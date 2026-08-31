import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../../../../../features/auth/services/auth.service';
import { UserProfile } from '../../../../../../shared/models/user-profile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../../../../../environments/environment';
import { UsersService } from '../../../../../../shared/services/users.service';
import { TypedModalService } from '../../../../../../shared/services/typed-modal.service';

@Component({
  selector: 'primary-info',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './primary-info.component.html',
  styleUrl: './primary-info.component.css'
})
export class PrimaryInfoComponent {
  private typedModalService = inject(TypedModalService);
  private usersService = inject(UsersService);
  //@Input() userProfile: UserProfile | undefined;
  environment = environment;

  userProfile$ = this.usersService.profile$;

  canEdit$ = this.usersService.canEdit$;

  onEditProfileClick() {
    this.typedModalService.open(EditProfileModalComponent, { currentTabId: 'profile.aboutme'});
  }
}
