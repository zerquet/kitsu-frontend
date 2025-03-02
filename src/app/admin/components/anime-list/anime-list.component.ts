import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, BehaviorSubject, Observable, combineLatest, switchMap, of, takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AuthService } from '../../../core/auth/services/auth.service';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { AsyncPipe } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'anime-list',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink, RouterOutlet],
  templateUrl: './anime-list.component.html',
  styleUrl: './anime-list.component.css'
})
export class AnimeListComponent {
  private animeService = inject(AnimeService);
  private modalService = inject(NgbModal);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  
  form = new FormGroup({ searchControl: new FormControl('') });
  currRoute = '/admin';
  currTab = 'anime';
  selectedAnime = -1;
  environment = environment;

  ngOnInit() {     
    this.form.controls['searchControl'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((value) => value !== null),
      takeUntil(this.destroy$)
    ).subscribe((value) => this.searchTerm$.next(value));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private destroy$ = new Subject<void>();
  searchTerm$ = new BehaviorSubject<string>('');
  searchList$: Observable<Anime[]> = this.animeService.getAnimes(); //get recent animes if no search query.
  filteredSearchList$: Observable<Anime[]> = combineLatest([this.searchList$, this.searchTerm$])
    .pipe(
      switchMap(([list, term]) => {
        if (term === '') {
          return of(list);
        }
        return of(this.filterList(term, list));
      }),
      takeUntil(this.destroy$)
    )

  deleteAnime(id: number) {
    //const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true });
    //modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: Anime[]) => list.filter(a => a.title.toLowerCase().includes(term.toLowerCase()));
}
