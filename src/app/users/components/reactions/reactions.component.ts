import { Component, inject, OnInit } from '@angular/core';
import { UsersService } from '../../../shared/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { ReactionCardComponent } from "../reaction-card/reaction-card.component";

@Component({
  selector: 'reactions',
  standalone: true,
  imports: [AsyncPipe, ReactionCardComponent],
  templateUrl: './reactions.component.html',
  styleUrl: './reactions.component.css'
})
export class ReactionsComponent implements OnInit {
  usersService = inject(UsersService);
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
