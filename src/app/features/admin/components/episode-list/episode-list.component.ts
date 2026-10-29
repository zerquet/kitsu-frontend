import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, BehaviorSubject, Observable, combineLatest, switchMap, of, takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { Episode } from '../../../../shared/models/episode.model';
import { EpisodeService } from '../../../../shared/services/episode.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-episode-list',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './episode-list.component.html'
})
export class EpisodeListComponent {
  private router = inject(Router);
  private episodeService = inject(EpisodeService);
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();
  form = new FormGroup({ searchControl: new FormControl('') });
  searchTerm$ = new BehaviorSubject<string>('');
  searchList$: Observable<Episode[]> = this.episodeService.getEpisodes(); //get recent animes if no search query.
  filteredSearchList$: Observable<Episode[]> = combineLatest([this.searchList$, this.searchTerm$])
    .pipe(
      switchMap(([list, term]) => {
        if (term === '') {
          return of(list);
        }
        return of(this.filterList(term, list));
      }),
      takeUntil(this.destroy$)
    )

  ngOnInit() {
    this.form.controls['searchControl'].valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((value) => value !== null),
        takeUntil(this.destroy$))
      .subscribe((value) => this.searchTerm$.next(value));
  }

  deleteEpisode(id: number) {
    // const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true }); //TODO look into.
    // modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: Episode[]) => list.filter(a => a.title!.toLowerCase().includes(term.toLowerCase()));

}
