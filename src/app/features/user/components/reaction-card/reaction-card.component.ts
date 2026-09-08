import { Component, inject, Input, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMediaReactionModalComponent } from '../edit-media-reaction-modal/edit-media-reaction-modal.component';
import { DeleteMediaReactionModalComponent } from '../delete-media-reaction-modal/delete-media-reaction-modal.component';
import { MediaReaction } from '../../../../shared/models/media-reaction.model';
import { UsersService } from '../../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';
import { UserAnimeService } from '../../../../shared/services/user-anime.service';

@Component({
  selector: 'reaction-card',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './reaction-card.component.html',
  styleUrl: './reaction-card.component.css'
})
export class ReactionCardComponent {
  private modalService = inject(NgbModal);
  private usersService = inject(UsersService);
  private userAnimeService = inject(UserAnimeService);
  @Input() reaction: MediaReaction | undefined; //TODO should i change this to access the current media reaction directly? or keep as input?
  environment = environment;
  reactionUrl = window.location.href;

  canEdit$ = this.usersService.canEdit$;

  onCopyLink() {
    //only works if page only shows a single reaction, otherwise, copies wrong URL
    navigator.clipboard.writeText(this.reactionUrl);
  }

  onEdit() {
    //TODO media reaction model from /media-reaction page is MediaReactionWithUser, whereas other pages use MediaReaction. How am i gonna deal with this difference? 
    if (!this.reaction) return;

    this.userAnimeService.changeCurrentMediaReaction(this.reaction);
    this.modalService.open(EditMediaReactionModalComponent);
  }

  onDelete() {
    if (!this.reaction) return;
    
    this.userAnimeService.changeCurrentMediaReaction(this.reaction);
    this.modalService.open(DeleteMediaReactionModalComponent)
  }
}
