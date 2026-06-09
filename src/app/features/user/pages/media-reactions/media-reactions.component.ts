import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap } from 'rxjs';
import { GetMediaReactionsByUserItemResponse } from '../../../../shared/contracts/getMediaReactionByUserItemResponse.interface';
import { UsersService } from '../../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from '../../components/reaction-card/reaction-card.component';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-media-reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent, RouterLink],
  templateUrl: './media-reactions.component.html',
  styleUrl: './media-reactions.component.css'
})
export class MediaReactionsComponent {
  route = inject(ActivatedRoute);
  usersService = inject(UsersService);
  authService = inject(AuthService);
  environment = environment;

  mediaReaction$ = this.route.params.pipe(
    switchMap(params => this.usersService.getMediaReactionById(params['id']))
  )

  userProfile$ = this.authService.authenticatedUser$;
  //latest change: diff session user and public reaction reaction UI
}
