import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from "../../../../components/reaction-card/reaction-card.component";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'users-reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent],
  templateUrl: './users-reactions.component.html',
  styleUrl: './users-reactions.component.css'
})
export class UsersReactionsComponent implements OnInit {
  private usersService = inject(UserAnimeService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);
  
  mediaReactions$ = this.usersService.mediaReactions$;
  
  ngOnInit(): void {
    this.route.params
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (params) => {
        this.usersService.loadUserMediaReactions(params['id'])
      }
    })
  }


}
