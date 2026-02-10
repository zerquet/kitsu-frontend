import { Component, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { BehaviorSubject, distinctUntilChanged, switchMap, takeUntil, debounceTime, tap, Subject, Observable, combineLatest, map, of } from 'rxjs';
import { Utils } from '../../../core/services/utils';
import { Anime } from '../../../shared/models/anime.model';
import { Category } from '../../../shared/models/category.model';
import { Franchise } from '../../../shared/models/franchise.model';
import { AnimeService } from '../../../shared/services/anime.service';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { CategoryService } from '../../../shared/services/category.service';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { CommonModule } from '@angular/common';
import { DatePicker } from 'primeng/datepicker';
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Select } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { TrimDirective } from '../../../core/directives/trim.directive';

@Component({
  selector: 'app-anime-add',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, TextareaModule, Select, MultiSelectModule, InputNumber, DatePicker, RouterLink, TrimDirective],
  templateUrl: './anime-add.component.html',
  styleUrl: './anime-add.component.css'
})
export class AnimeAddComponent {
  private categoryService = inject(CategoryService);
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private franchiseService = inject(FranchiseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form = new FormGroup({ //some not working check
    title: new FormControl('', Validators.required ),
    description: new FormControl(''),
    image: new FormControl<File | undefined>(undefined, Validators.required),
    coverImage: new FormControl<File | undefined>(undefined),
    releaseStatus: new FormControl(''),
    categories: new FormControl<number[]>([]),
    episodes: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    year: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    mediaType: new FormControl(''),
    score: new FormControl<number | null>(null, Validators.pattern("[0-9]*")),
    englishTitle: new FormControl(''),
    japaneseTitle: new FormControl(''),
    japaneseRomaji: new FormControl(''),
    season: new FormControl(''),
    startAirDate: new FormControl<Date | null>(null),
    endAirDate: new FormControl<Date | null>(null),
    rating: new FormControl(''),
    episodeLength: new FormControl(0),
    franchiseSearch: new FormControl(),
    franchiseId: new FormControl<Number | null>(null)
  });
  selectedFranchise: Franchise | null = null;
  showFranchiseSearchResults = false;
  airingStatuses = ['Finished', 'Airing', 'Upcoming'];
  mediaTypes = ['TV', 'Movie', 'ONA'];
  maturityRatings = ['PG', 'R'];
  newAnimeImage: string | undefined = undefined;     
  newCoverImage: string | undefined = undefined;                                           

  ngOnInit(): void {
    this.form.controls['franchiseSearch'].valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      tap(term => {
        if(term && term.trim().length > 0)
          this.showFranchiseSearchResults = true;
        else 
          this.showFranchiseSearchResults = false;
      }),
      takeUntil(this.destroy$)
    ).subscribe(res => this.franchiseSearchTerm$.next(res));
  }

  private destroy$ = new Subject<void>();
  availableCategories$: Observable<Category[]> = this.categoryService.getCategories();
  franchiseSearchTerm$ = new BehaviorSubject<string>("");
  franchiseList$ = combineLatest([this.franchiseSearchTerm$]).pipe(
    distinctUntilChanged(),
    map(([term]) => term),
    switchMap(term => this.searchFranchises(term)),
    takeUntil(this.destroy$)
  );

  onSubmit() {
    //this.getFormValidationErrors();
    const data = new FormData();
    data.append('title', this.title!.value!);
    if(!Utils.IsNullOrUndefined(this.description!.value)) data.append('description', this.description?.value!); 
    if(!Utils.IsNullOrUndefined(this.image!.value)) data.append('image', (this.image as AbstractControl).value as File);
    if(!Utils.IsNullOrUndefined(this.coverImage!.value)) data.append('coverImage', (this.coverImage as AbstractControl).value as File);
    if(!Utils.IsNullOrUndefined(this.year!.value)) data.append('year', this.year!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.episodes!.value)) data.append('episodeCount', this.episodes!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.mediaType!.value)) data.append('mediaType', this.mediaType!.value!);
    if(!Utils.IsNullOrUndefined(this.score!.value)) data.append('score', this.score!.value!.toString()!);
    if(!Utils.IsNullOrUndefined(this.releaseStatus!.value)) data.append('releaseStatus', this.releaseStatus!.value!);
    if (!Utils.IsNullOrUndefined(this.categories!.value)) {
      for(let i = 0; i < this.categories!.value!.length; i++) {
        data.append('categories', this.categories!.value![i].toString())
      }
    }
    if(!Utils.IsNullOrUndefined(this.englishTitle!.value)) data.append('englishTitle', this.englishTitle!.value!);
    if(!Utils.IsNullOrUndefined(this.japaneseTitle!.value)) data.append('japaneseTitle', this.japaneseTitle!.value!);
    if(!Utils.IsNullOrUndefined(this.japaneseRomaji!.value)) data.append('japaneseTitleRomaji', this.japaneseRomaji?.value!);
    if(!Utils.IsNullOrUndefined(this.season!.value)) data.append('season', this.season!.value!);
    if(!Utils.IsNullOrUndefined(this.startAirDate!.value)) data.append('startAirDate', this.startAirDate!.value!.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.endAirDate!.value)) data.append('endAirDate', this.endAirDate!.value!.toLocaleDateString());
    if(!Utils.IsNullOrUndefined(this.rating!.value)) data.append('tvRating', this.rating!.value!);
    if(!Utils.IsNullOrUndefined(this.episodeLength!.value)) data.append('episodeLength', this.episodeLength!.value?.toString()!);
    if(!Utils.IsNullOrUndefined(this.franchiseId!.value)) data.append('franchiseId', this.franchiseId!.value!.toString())
  
    this.animeService
      .addAnime(data)
      .subscribe({
        next: () => {
          this.toastService.show('Success', 'Added anime record')
          //this.form.reset();
          this.router.navigate(['/admin/anime']);
        },
        error: (err) => {
          console.log(err);
          
          this.toastService.show('Error', 'Something went wrong. Check logs for more details.')
        }
      });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newAnimeImage = reader.result?.toString();
    }
    this.form.patchValue({image: file});
  }

  onImageClear() {
    this.newAnimeImage = undefined;
    this.form.patchValue({image: undefined});
    return;
  }

  onCoverImagePicked(event: Event) {
    const coverFile = (event.target as HTMLInputElement).files![0];
    const reader = new FileReader();
    reader.readAsDataURL(coverFile);
    reader.onload = (_event) => {
      this.newCoverImage = reader.result?.toString();
    }
    this.form.patchValue({coverImage: coverFile});
  }

  onCoverImageClear() {
    this.newCoverImage = undefined;
    this.form.patchValue({coverImage: undefined});
    return;
  }

  private searchFranchises(term: string): Observable<Franchise[]> {
    term = term.toLowerCase().trim();
    if(term.length === 0)
      return of([]);
    return this.franchiseService.getFranchisesByKeyword(term);
  }

  selectFranchise(franchise: Franchise) {
    this.selectedFranchise = franchise;
    this.form.patchValue({ franchiseId: franchise.id });
    this.showFranchiseSearchResults = false;
    this.franchiseSearchTerm$.next("");
  }

  deselectAnime() {
    this.selectedFranchise = null;
    this.form.patchValue({ franchiseId: null }); //keep replicating from []
  }

  onClearMediaType() {
    this.mediaType?.patchValue('');
  }

  //FORM GETTERS
  get animeId() { return this.form.get('animeId'); }
  
  get title() { return this.form.get('title'); }

  get description() { return this.form.get('description'); }

  get image() { return this.form.get('image'); }

  get releaseStatus() { return this.form.get('releaseStatus'); }

  get categories() { return this.form.get('categories'); }

  get coverImage() { return this.form.get('coverImage'); }
  get episodes() { return this.form.get('episodes'); }

  get mediaType() { return this.form.get('mediaType'); }

  get year() { return this.form.get('year'); }
  
  get score() { return this.form.get('score'); }

  get englishTitle() { return this.form.get('englishTitle'); }

  get japaneseTitle() { return this.form.get('japaneseTitle'); }

  get japaneseRomaji() { return this.form.get('japaneseRomaji'); }

  get season() { return this.form.get('season'); }

  get startAirDate() { return this.form.get('startAirDate'); }

  get endAirDate() { return this.form.get('endAirDate'); }

  get rating() { return this.form.get('rating'); }

  get episodeLength() { return this.form.get('episodeLength'); }

  get franchiseId() { return this.form.get('franchiseId'); }
}
