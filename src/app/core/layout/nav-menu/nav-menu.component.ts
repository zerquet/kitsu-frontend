import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, combineLatest, map, switchMap, takeUntil, debounceTime, distinctUntilChanged, tap, of, filter } from 'rxjs';
import { Anime } from '../../../shared/models/anime.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { NavMenuSearchDataService } from '../../../shared/services/nav-menu-search-data.service';
import { AuthService } from '../../../features/auth/services/auth.service';
import { LoginComponent } from '../../../features/auth/login/login.component';
import { RegisterComponent } from '../../../features/auth/register/register.component';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SearchResultsComponent } from '../../../shared/components/search-results/search-results.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'nav-menu',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, SearchResultsComponent],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css'
})
export class NavMenuComponent {
  private modalService = inject(NgbModal);
  private animeService = inject(AnimeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();
  private navMenuSearchDataService = inject(NavMenuSearchDataService);
  show$ = this.navMenuSearchDataService.show$;
  term$ = this.navMenuSearchDataService.term$;
  authenticatedUser$ = this.authService.authenticatedUser$;
  form = new FormGroup({ searchControl: new FormControl() });
  environment = environment;
  activeMenuItem = "";

  searchResults$: Observable<Anime[]> = combineLatest([this.term$])
    .pipe(
      map(([term]) => term),
      switchMap(term => this.search(term)),
      takeUntil(this.destroy$)); //TODO mini search logic is duplicate from home component. shared?

  ngOnInit(): void {
    this.checkUrl(this.router.url);

    this.form.controls['searchControl'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(term => {
        if (term && term.trim().length > 0)
          this.show$.next(true);
        else
          this.show$.next(false);
      }),
      takeUntil(this.destroy$)
    )
      .subscribe(term => this.term$.next(term));

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.checkUrl(event.urlAfterRedirects);
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private search(term: string): Observable<Anime[]> {
    term = term.toLowerCase().trim();
    if (term.length === 0)
      return of([]);
    return this.animeService.miniSearch(term);
  }

  openSignInModal() {
    const signInModalRef = this.modalService.open(LoginComponent)
    signInModalRef.componentInstance.name = "Sign In";
  }

  openSignUpModal() {
    const signUpModalRef = this.modalService.open(RegisterComponent);
    signUpModalRef.componentInstance.name = "Sign Up";
  }

  logout() {
    this.authService.logout();
  }

  private checkUrl(url: string) {
    if (url.includes('anime')) {
      this.activeMenuItem = 'anime';
    }
    else if (url.includes('users')) {
      this.activeMenuItem = 'library'
    }
    else {
      this.activeMenuItem = '';
    }
  }
}
