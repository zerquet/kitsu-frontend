import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap, tap } from 'rxjs';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from '../../components/reaction-card/reaction-card.component';
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
  private route = inject(ActivatedRoute);
  private userAnimeService = inject(UserAnimeService);
  private usersService = inject(UsersService);
  environment = environment;

  mediaReaction$ = this.route.params.pipe(
    switchMap(params => this.userAnimeService.getMediaReactionById(params['id'])),
    tap(reaction => this.usersService.setProfile(reaction.userProfile))
  )

  canEdit$ = this.usersService.canEdit$;
  userProfile$ = this.usersService.profile$
  vm$ = combineLatest([
    this.mediaReaction$,
    this.userProfile$
  ]).pipe(map(([mediaReaction, userProfile]) => ({ mediaReaction, userProfile })))
}
