import { Component, inject, Input } from '@angular/core';
import { GetMediaReactionsByUserItemResponse } from '../../../shared/contracts/getMediaReactionByUserItemResponse.interface';
import { environment } from '../../../../environments/environment';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditMediaReactionComponent, EditMediaReactionModel } from '../edit-media-reaction/edit-media-reaction.component';
import { DeleteMediaReactionComponent } from '../delete-media-reaction/delete-media-reaction.component';
import { MediaReaction } from '../../../shared/models/mediaReaction.model';

@Component({
  selector: 'reaction-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './reaction-card.component.html',
  styleUrl: './reaction-card.component.css'
})
export class ReactionCardComponent {
  private modalService = inject(NgbModal);
  @Input() reaction: MediaReaction | undefined;
  environment = environment;
  reactionUrl = window.location.href;

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
      animeTitle: this.reaction?.anime.title,
      animeImageUrl: this.reaction?.anime.imageUrl
    }
    const modal = this.modalService.open(EditMediaReactionComponent);
    modal.componentInstance.initializeModalData(model)
  }

  onDeleteReactionClick(reactionId: number) {
    const modal = this.modalService.open(DeleteMediaReactionComponent)
    modal.componentInstance.initializeModalData(reactionId)
  }
}
