import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';
import { GetCategoryResponseDto } from '../../features/anime/dtos/get-category-response.dto';
import { mapGetCategoryToCategory } from '../mappers/category.mapper';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  private _categories$ = new BehaviorSubject<Category[]>([]);
  private _currentCategoryDescriptionSubject = new BehaviorSubject<string>('');
  currentCategoryDescription$ = this._currentCategoryDescriptionSubject.asObservable();
  private _currentCategorySubject = new BehaviorSubject<Category | null>(null);
  currentCategory$ = this._currentCategorySubject.asObservable();
  private _collectionLabelSubject = new BehaviorSubject<string | undefined>(undefined);

  currentCategorySummary$ = combineLatest([this.currentCategory$, this._collectionLabelSubject]).pipe(
    map(([category, label]) => {
      if (!category && !label) return 'Explore Anime';
      return [label, category?.name, 'Anime'].filter(Boolean).join(' ');
    })
  );

  constructor() {
    this.http.get<Category[]>(this.baseUrl)
      .subscribe((categories) => {
        this._categories$.next(categories);
      });
  }

  setCategory(categorySlug?: string) {
    if (!categorySlug) {
      this.resetCurrentCategory();
      return;
    }
    if (this.isCategoryLoaded(categorySlug)) return;
    this.http.get<GetCategoryResponseDto>(`${this.baseUrl}/${categorySlug}`)
      .pipe(map(mapGetCategoryToCategory))
      .subscribe((category) => {
        this._currentCategoryDescriptionSubject.next(category.description ?? '');
        this._currentCategorySubject.next(category);
      })
  }

  setCollection(label?: string) {
    this._collectionLabelSubject.next(label);
  }

  private resetCurrentCategory() {
    this._currentCategoryDescriptionSubject.next('')
    this._currentCategorySubject.next(null);
  }

  private isCategoryLoaded(categorySlug: string) {
    return this._currentCategorySubject.value?.slug === categorySlug;
  }

  getCategories(): Observable<Category[]> {
    return this._categories$;
  }
}
