import { Component, inject, OnInit } from '@angular/core';
import { UserAnimeService } from '../../../../../../shared/services/user-anime.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from "../../../../components/reaction-card/reaction-card.component";

@Component({
  selector: 'users-reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent],
  templateUrl: './users-reactions.component.html',
  styleUrl: './users-reactions.component.css'
})
export class UsersReactionsComponent implements OnInit {
  usersService = inject(UserAnimeService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.route.params.subscribe({
      next: (params) => {
        this.usersService.setMediaReactionsStateByUserId(params['id'])
      }
    })
  }

  mediaReactions$ = this.usersService.mediaReactions$;

}
