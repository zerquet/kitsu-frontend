import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap, takeUntil, tap } from 'rxjs';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from '../../components/reaction-card/reaction-card.component';
import { environment } from '../../../../../environments/environment';
import { UsersService } from '../../../../shared/services/users.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-media-reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent, RouterLink],
  templateUrl: './media-reactions.component.html',
  styleUrl: './media-reactions.component.css'
})
export class MediaReactionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userAnimeService = inject(UserAnimeService);
  private usersService = inject(UsersService);
  private destroyRef = inject(DestroyRef);
  environment = environment;

  ngOnInit() {
    this.route.params.pipe(
      switchMap(params => this.userAnimeService.loadCurrentMediaReaction(params['id'])),
      tap(reaction => this.usersService.setProfile(reaction.userProfile)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe()
  }

  canEdit$ = this.usersService.canEdit$;
  userProfile$ = this.usersService.profile$
  mediaReaction$ = this.userAnimeService.currentMediaReaction$;
  vm$ = combineLatest([
    this.mediaReaction$,
    this.userProfile$
  ]).pipe(map(([mediaReaction, userProfile]) => ({ mediaReaction, userProfile })))
}
