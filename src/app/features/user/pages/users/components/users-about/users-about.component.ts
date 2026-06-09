import { Component, inject, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';

@Component({
  selector: 'users-about',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './users-about.component.html',
  styleUrl: './users-about.component.css'
})
export class UsersAboutComponent implements OnInit {
  private usersService = inject(UserAnimeService);
  private modalService = inject(NgbModal);
  //@Input() userProfile: UserProfile | undefined;
  environment = environment;

  ngOnInit(): void {
    this.usersService.setFavoriteAnimesState();
  }

  userProfile$ = this.usersService.profile$;
  favoriteAnimes$ = this.usersService.favoriteAnimes$;

  onEditProfileClick() {
    const modal = this.modalService.open(EditProfileModalComponent);
    modal.componentInstance.initializeModalData('favorites');
    //set input() to open to a tab
  }
}
