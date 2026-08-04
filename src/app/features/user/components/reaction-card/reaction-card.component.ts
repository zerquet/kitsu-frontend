import { Component, inject, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMediaReactionModalComponent } from '../edit-media-reaction-modal/edit-media-reaction-modal.component';
import { DeleteMediaReactionModalComponent } from '../delete-media-reaction-modal/delete-media-reaction-modal.component';
import { MediaReaction } from '../../../../shared/models/mediaReaction.model';
import { UsersService } from '../../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';
import { EditMediaReactionModel } from '../../models/edit-media-reaction.model';

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
  @Input() reaction: MediaReaction | undefined;
  environment = environment;
  reactionUrl = window.location.href;

  canEdit$ = this.usersService.canEdit$;

  onCopyLink() {
    //only works if page only shows a single reaction, otherwise, copies wrong URL
    navigator.clipboard.writeText(this.reactionUrl);
  }

  onEdit(mediaReactionId: number) {
    if (!this.reaction) return;

    const model: EditMediaReactionModel = {
      mediaReactionId: mediaReactionId,
      userId: this.reaction.userId,
      libraryEntryId: this.reaction.libraryEntryId,
      animeId: this.reaction.animeId,
      reaction: this.reaction.reaction,
      animeTitle: this.reaction.anime.title,
      animeImageUrl: this.reaction.anime.imageUrl
    }
    const modal = this.modalService.open(EditMediaReactionModalComponent);
    modal.componentInstance.initializeModalData(model)
  }

  onDelete(reactionId: number) {
    const modal = this.modalService.open(DeleteMediaReactionModalComponent)
    modal.componentInstance.initializeModalData(reactionId)
  }
}
