import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, takeUntil, BehaviorSubject, combineLatest, map, switchMap, Observable, of, Subject } from 'rxjs';
import { Anime } from '../../../../../../shared/models/anime.model';
import { AnimeService } from '../../../../../../shared/services/anime.service';
import { SearchResultsComponent } from '../../../../../../shared/components/search-results/search-results.component';
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'main-search',
  standalone: true,
  imports: [ReactiveFormsModule, SearchResultsComponent, RouterLink],
  templateUrl: './main-search.component.html',
  styleUrl: './main-search.component.css'
})
export class MainSearchComponent {
  private animeService = inject(AnimeService);
  private destroyRef = inject(DestroyRef);
  showResults = false;
  form = new FormGroup({ searchControl: new FormControl() });

  ngOnInit(): void {
    this.form.controls['searchControl'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(term => {
        if (term && term.trim().length > 0)
          this.showResults = true;
        else
          this.showResults = false;
      }),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(term => this.term$.next(term));
  }

  term$ = new BehaviorSubject<string>("");

  //why cant i just use this.term$ here? why do i need to use combineLatest? this.term$ just returns the first char
  searchResults$ = combineLatest([this.term$]).pipe(
    map(([term]) => term),
    switchMap(term => this.search(term)),
    takeUntilDestroyed(this.destroyRef));

  private search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if (term.length === 0)
      return of([]);
    return this.animeService.getAnimeByTitle(term);
  }
}
