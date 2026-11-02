import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AnimeService } from '../../../../../../shared/services/anime.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'anime-reactions',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './anime-reactions.component.html',
  styleUrl: './anime-reactions.component.css'
})
export class AnimeReactionsComponent implements OnInit {
  private animeService = inject(AnimeService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  animeMediaReactions$ = this.animeService.animeReactions$;

  ngOnInit(): void {
    this.route.params
      .pipe(
        map(params => params['id']),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (id) => this.animeService.loadAnimeMediaReactions(id)
      });
  }
  
  onCopyLink(reactionId: number) {
    //only works if page only shows a single reaction, otherwise, copies wrong URL
    navigator.clipboard.writeText(`${window.location.origin}/media-reactions/${reactionId}`);
  }
}
