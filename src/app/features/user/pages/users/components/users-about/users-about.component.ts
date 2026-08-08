import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '../../../../../../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../edit-profile-modal/edit-profile-modal.component';
import { UsersService } from '../../../../../../shared/services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'users-about',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './users-about.component.html',
  styleUrl: './users-about.component.css'
})
export class UsersAboutComponent implements OnInit {
  private userAnimeService = inject(UserAnimeService);
  private usersService = inject(UsersService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  //@Input() userProfile: UserProfile | undefined;
  environment = environment;

  ngOnInit(): void {
    this.route.params.pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (params) => {
        this.userAnimeService.loadFavoriteAnime(params['id']);
      }
    })
  }

  userProfile$ = this.userAnimeService.profile$;
  favoriteAnimes$ = this.userAnimeService.favoriteAnimes$;
  canEdit$ = this.usersService.canEdit$;

  onEditProfile() {
    const modal = this.modalService.open(EditProfileModalComponent);
    modal.componentInstance.initializeModalData('profile.favorites');
    //set input() to open to a tab
  }
}
