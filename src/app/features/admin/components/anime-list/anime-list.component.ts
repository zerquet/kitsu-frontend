import { Component, DestroyRef, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {  RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject, Observable, switchMap, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { AsyncPipe } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AnimeTableItem } from '../../models/anime-table-item.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'anime-list',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterLink],
  templateUrl: './anime-list.component.html'
})
export class AnimeListComponent {
  private adminService = inject(AdminService);
  public authService = inject(AuthService);
  private destroyRef = inject(DestroyRef); 

  form = new FormGroup({ searchControl: new FormControl('') });

  ngOnInit() {
    this.form.controls['searchControl'].valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((term) => {
      this.searchTerm$.next(term ? term.toLocaleLowerCase() : "")
    });
  }

  searchTerm$ = new BehaviorSubject<string>('');
  // Single stream carrying both loading state and results, so the template subscribes once
  // and toggling the spinner never tears down (and cancels) the in-flight request.
  searchState$: Observable<{ loading: boolean; results: AnimeTableItem[] }> = this.searchTerm$.pipe(
    switchMap(term => this.adminService.searchAnime(term).pipe(
      map(results => ({ loading: false, results })),
      startWith({ loading: true, results: [] as AnimeTableItem[] })
    )),
    takeUntilDestroyed(this.destroyRef)
  );

  deleteAnime(id: number) {
    //const modal = this.modalService.open(DeleteAnimeModalComponent, { size: 'sm', centered: true });
    //modal.componentInstance.initializeModalData(id);
  }

  private filterList = (term: string, list: AnimeTableItem[]) => list.filter(a => a.title.toLowerCase().includes(term.toLowerCase()));
}
