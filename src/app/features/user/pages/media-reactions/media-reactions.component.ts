import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, switchMap, tap } from 'rxjs';
import { GetMediaReactionByIdResponseDto } from '../../dtos/get-media-reaction-by-id-response.dto';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from '../../components/reaction-card/reaction-card.component';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../../../shared/services/users.service';

@Component({
  selector: 'app-media-reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent, RouterLink],
  templateUrl: './media-reactions.component.html',
  styleUrl: './media-reactions.component.css'
})
export class MediaReactionsComponent {
  route = inject(ActivatedRoute);
  userAnimeService = inject(UserAnimeService);
  usersService = inject(UsersService);
  authService = inject(AuthService);
  environment = environment;

  mediaReactionResponse$ = this.route.params.pipe(
    switchMap(params => this.userAnimeService.getMediaReactionById(params['id'])),
    tap(reaction => this.usersService.setProfile(reaction.userProfile))
  )

  canEdit$ = this.usersService.canEdit$;
  userProfile$ = this.usersService.profile$
  vm$ = combineLatest([
    this.mediaReactionResponse$,
    this.userProfile$
  ]).pipe(map(([mediaReaction, userProfile]) => ({ mediaReaction, userProfile })))
}
