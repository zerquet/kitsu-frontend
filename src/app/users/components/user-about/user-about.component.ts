import { Component, inject, Input, OnInit } from '@angular/core';
import { UserProfile } from '../../../shared/models/userProfile.model';
import { UsersService } from '../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'user-about',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './user-about.component.html',
  styleUrl: './user-about.component.css'
})
export class UserAboutComponent implements OnInit {
  private usersService = inject(UsersService);
  //@Input() userProfile: UserProfile | undefined;

  ngOnInit(): void {
    this.usersService.setFavoriteAnimesState();
  }

  userProfile$ = this.usersService.getCurrentUserProfile();
  favoriteAnimes$ = this.usersService.getFavoriteAnimes();
}
