import { Component, inject, Input } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';
import { UsersService } from '../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'primary-info',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './primary-info.component.html',
  styleUrl: './primary-info.component.css'
})
export class PrimaryInfoComponent {
  authService = inject(AuthService);
  modalService = inject(NgbModal);
  private usersService = inject(UsersService);
  //@Input() userProfile: UserProfile | undefined;

  userProfile$ = this.usersService.getCurrentUserProfile();

  onEditProfileClick() {
    const modal = this.modalService.open(EditProfileComponent);
    modal.componentInstance.initializeModalData();
    //set input() to open to a tab
  }
}
