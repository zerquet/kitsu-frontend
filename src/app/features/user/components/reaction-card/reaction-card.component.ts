import { Component, inject, Input } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMediaReactionModalComponent, EditMediaReactionModel } from '../edit-media-reaction-modal/edit-media-reaction-modal.component';
import { DeleteMediaReactionModalComponent } from '../delete-media-reaction-modal/delete-media-reaction-modal.component';
import { MediaReaction } from '../../../../shared/models/mediaReaction.model';
import { UsersService } from '../../../../shared/services/users.service';
import { AsyncPipe } from '@angular/common';

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

  onCopyLinkClick() {
    //only works if page only shows a single reaction, otherwise, copies wrong URL
    navigator.clipboard.writeText(this.reactionUrl);
  }

  onEditReactionClick(reactionId: number) {
    const model: EditMediaReactionModel = {
      reactionId: reactionId,
      userId: this.reaction?.userId,
      libraryEntryId: this.reaction?.libraryEntryId,
      animeId: this.reaction?.animeId,
      reaction: this.reaction?.reaction,
      animeTitle: this.reaction?.animeTitle,
      animeImageUrl: this.reaction?.animeImageUrl
    }
    const modal = this.modalService.open(EditMediaReactionModalComponent);
    modal.componentInstance.initializeModalData(model)
  }

  onDeleteReactionClick(reactionId: number) {
    const modal = this.modalService.open(DeleteMediaReactionModalComponent)
    modal.componentInstance.initializeModalData(reactionId)
  }
}
