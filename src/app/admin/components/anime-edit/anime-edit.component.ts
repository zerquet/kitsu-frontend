import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnimeService } from '../../../shared/services/anime.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputNumber } from 'primeng/inputnumber';
import { DatePicker } from 'primeng/datepicker';
import { Subject, Observable, BehaviorSubject, combineLatest, distinctUntilChanged, map, switchMap, takeUntil, of, debounceTime, tap } from 'rxjs';
import { Franchise } from '../../../shared/models/franchise.model';
import { AppToastService } from '../../../shared/services/app-toast.service';
import { CategoryService } from '../../../shared/services/category.service';
import { FranchiseService } from '../../../shared/services/franchise.service';
import { Anime } from '../../../shared/models/anime.model';
import { Utils } from '../../../core/services/utils';
import { Category } from '../../../shared/models/category.model';
import { TrimDirective } from '../../../core/directives/trim.directive';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-anime-edit',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, InputTextModule, TextareaModule, Select, MultiSelectModule, InputNumber, DatePicker, RouterLink, TrimDirective],
  templateUrl: './anime-edit.component.html',
  styleUrl: './anime-edit.component.css'
})
export class AnimeEditComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private animeService = inject(AnimeService);
  private toastService = inject(AppToastService);
  private franchiseService = inject(FranchiseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form = new FormGroup({ //some not working check
    animeId: new FormControl<number | null>(null),
    title: new FormControl('', [Validators.required, this.titleIsDifferentValidator()]),
    description: new FormControl('', [this.descriptionIsDifferentValidator()]),
    image: new FormControl<File | undefined>(undefined, [this.imageIsDifferentValidator()]),
    coverImage: new FormControl<File | undefined>(undefined, [this.coverImageIsDifferentValidator()]),
    releaseStatus: new FormControl('', [this.releaseStatusIsDifferentValidator()]),
    categories: new FormControl<number[]>([], this.categoriesAreDifferentValidator()),
    episodes: new FormControl<number | null>(null, [Validators.pattern("[0-9]*"), this.episodeCountIsDifferentValidator()]),
    year: new FormControl<number | null>(null, [Validators.pattern("[0-9]*"), this.yearIsDifferentValidator()]),
    mediaType: new FormControl('', [this.mediaTypeIsDifferentValidator()]),
    score: new FormControl<number | null>(null, [Validators.pattern("[0-9]*"), this.scoreIsDifferentValidator()]),
    englishTitle: new FormControl('', [this.englishTitleIsDifferentValidator()]),
    japaneseTitle: new FormControl('', [this.japaneseTitleIsDifferentValidator()]),
    japaneseRomaji: new FormControl('', [this.japaneseRomajiIsDifferentValidator()]),
    season: new FormControl('', [this.seasonIsDifferentValidator()]),
    startAirDate: new FormControl<Date | null>(null, [this.startAirDateIsDifferentValidator()]),
    endAirDate: new FormControl<Date | null>(null, [this.endAirDateIsDifferentValidator()]),
    rating: new FormControl('', [this.ratingIsDifferentValidator()]),
    episodeLength: new FormControl(0, [this.episodeLengthIsDifferentValidator()]),
    franchiseSearch: new FormControl(),
    franchiseId: new FormControl<Number | null>(null, [this.franchiseIdIsDifferentValidator()])
  });
  selectedFranchise: Franchise | null = null;
  showFranchiseSearchResults = false;
  airingStatuses = ['Finished', 'Airing', 'Upcoming'];
  mediaTypes = ['TV', 'Movie', 'ONA'];
  maturityRatings = ['PG', 'R'];
  anime = new BehaviorSubject<Anime | null>(null);
  newAnimeImage: string | undefined = undefined;     
  newCoverImage: string | undefined = undefined;                                           
  environment = environment;
  
  ngOnInit(): void {
    this.route.params.pipe(
      distinctUntilChanged(),
      switchMap(params => this.animeService.getAnime(params['animeId'])),
      takeUntil(this.destroy$)
    ).subscribe(res => {
        if(res !== undefined) {
          this.anime.next(res);
          this.prefillform(res);
          //send dto from api and assign as Franchise 
          this.selectedFranchise = res.details.franchiseId !== null && res.details.franchiseName !== null ? {id: res.details.franchiseId, name: res.details.franchiseName} : null;           
        }
      })

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
    data.append('id', this.animeId!.value!.toString());
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
    if(!Utils.IsNullOrUndefined(this.franchiseId!.value)) data.append('franchiseId', this.franchiseId!.value!.toString());
  
    this.animeService
      .updateAnime(data, this.selectedFranchise ?? undefined)
      .subscribe({
        next: () => {
          this.toastService.show('Success', `Updated '${this.title?.value}'.`)
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
    console.log('updatefn');
    this.form.patchValue({image: file});
    
  }

  onImageClear() {
    this.newAnimeImage = undefined;
    this.form.patchValue({image: undefined});
    //why is the form submitted when this method runs?
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

  private prefillform(res: Anime) {
    this.form.patchValue({
      animeId: res.id,
      title: res.title,
      description: res.description,
      releaseStatus: res.details.releaseStatus,
      categories: res.categories.map(x => x.id), //might need to use Id instead. I assume it's comparing [value] to see which are selected
      episodes: res.details.episodeCount,
      year: res.year,
      mediaType: res.details.mediaType,
      score: res.score,
      englishTitle: res.details.englishTitle,
      japaneseTitle: res.details.japaneseTitle,
      japaneseRomaji: res.details.japaneseTitleRomaji,
      season: res.details.season,
      startAirDate: res.details.startAirDate === null ? null : new Date(res.details.startAirDate),
      endAirDate: res.details.endAirDate === null ? null : new Date(res.details.endAirDate),
      rating: res.details.tvRating !== "null" ? res.details.tvRating : null,
      episodeLength: res.details.episodeLength,
      franchiseId: res.details.franchiseId ?? null
    });
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

  /**FORM VALIDATORS (move to separate class)*/
  titleIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.title) {          
          return null;
        }
      }
      
      return {titleIsDifferent:true};
    }
  }

  descriptionIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.description)
          return null;
      }
      return {descriptionIsDifferent:true};
    }
  }

  imageIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      var file = control.value as File | null | undefined;
      console.log(file);
      
      if(file === null || file === undefined) {
        return null;
      }
      
      return {imageIsDifferent:true};
    }
  }

  coverImageIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      var file = control.value as File | null | undefined;      
      if(file === null || file === undefined) {
        return null;
      }
      
      return {coverImageIsDifferent:true};
    }
  }

  releaseStatusIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.releaseStatus)
          return null;
      }
      return {releaseStatusIsDifferent:true};
    }
  }

  categoriesAreDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        var categoryIds = this.anime.value?.categories.map(x => x.id).sort();
        var controlValue = control.value.sort();

        if(JSON.stringify(controlValue)==JSON.stringify(categoryIds)) //what if order is different? not safe proof. do images and other too. fix franchise
          return null;
      }      
      return {categoriesAreDifferent:true};
    }
  }

  episodeCountIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.episodeCount)
          return null;
      }
      return {episodeCountIsDifferent:true};
    }
  }

  mediaTypeIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.mediaType)
          return null;
      }
      return {mediaTypeIsDifferent:true};
    }
  }

  yearIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.year)
          return null;
      }
      return {yearIsDifferent:true};
    }
  }

  scoreIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.score)
          return null;
      }
      return {scoreIsDifferent:true};
    }
  }

  englishTitleIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.englishTitle)
          return null;
      }
      return {englishTitleIsDifferent:true};
    }
  }

  japaneseTitleIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.japaneseTitle)
          return null;
      }
      return {japaneseTitleIsDifferent:true};
    }
  }

  japaneseRomajiIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.japaneseTitleRomaji)
          return null;
      }
      return {japaneseRomajiIsDifferent:true};
    }
  }

  seasonIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.season)
          return null;
      }
      return {seasonIsDifferent:true};
    }
  }

  startAirDateIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      if(this.anime !== undefined) {
        var date;
        if(this.anime.value === null) {
          date = null;
        }
        else {
          date = this.anime.value?.details.startAirDate === null ? null : new Date(this.anime.value!.details.startAirDate);
        }
                
        if(date !== null) {
          if(control.value.toDateString() === date.toDateString()) {
            return null;
          }
        }
        else {
          if(control.value === date) {
            return null;
          }
        }
      }
      return {startAirDateIsDifferent:true};
    }
  }

  endAirDateIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        var date;
        if(this.anime.value === null) {
          date = null;
        }
        else {
          date = this.anime.value?.details.endAirDate === null ? null : new Date(this.anime.value!.details.endAirDate);
        }
          
        if(date !== null) {
          if(control.value.toDateString() === date.toDateString()) {
            return null;
          }
        }
        else {
          if(date === control.value) {
            return null;
          }
        }  
      }
      return {endAirDateIsDifferent:true};
    }
  }

  ratingIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.tvRating)
          return null;
      }
      return {ratingIsDifferent:true};
    }
  }

  episodeLengthIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if(this.anime !== undefined) {
        if(control.value === this.anime.value?.details.episodeLength)
          return null;
      }
      return {episodeLengthIsDifferent:true};
    }
  }

  franchiseIdIsDifferentValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {      
      if(this.anime !== undefined) {
        console.log(control.value);
        console.log(this.anime.value?.details.franchiseId);
        if(control.value === this.anime.value?.details.franchiseId)
          return null;
      }
      return {franchiseIdIsDifferent:true};
    }
  }

  getFormValidationErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors: ValidationErrors = this.form.get(key)!.errors!;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
         console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }
}
