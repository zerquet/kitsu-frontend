import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileComponent } from '../edit-profile/edit-profile.component';

@Component({
  selector: 'user-about',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-about.component.html',
  styleUrl: './user-about.component.css'
})
export class UserAboutComponent implements OnInit {
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  //@Input() userProfile: UserProfile | undefined;
  environment = environment;

  ngOnInit(): void {
    this.usersService.setFavoriteAnimesState();
  }

  userProfile$ = this.usersService.profile$;
  favoriteAnimes$ = this.usersService.favoriteAnimes$;

  onEditProfileClick() {
    const modal = this.modalService.open(EditProfileComponent);
    modal.componentInstance.initializeModalData('favorites');
    //set input() to open to a tab
  }
}
