import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/categories`;

  private _categories$ = new BehaviorSubject<Category[]>([]);
  private _currentCategorySummarySubject = new BehaviorSubject<string>('Explore Anime');
  currentCategorySummary$ = this._currentCategorySummarySubject.asObservable();

  constructor() {
    this.http.get<Category[]>(this.baseUrl)
      .subscribe((categories) => {
        this._categories$.next(categories);
      });
  }

  getCategory(name: string): Observable<Category> {
    return this._categories$.pipe(
      switchMap((categories) => {
        let category = categories.find((category) => category.name === name);
        if(category === undefined) {
          let noCategory: Category = {
            id: 0,
            name: 'Explore'
          }
          return of(noCategory);
        }
        
        return of(category);
      })
    );
  }

  
  changeCurrentCategorySummary(summary?: string) {
    summary = !summary ? 'Explore Anime' : summary;
    this._currentCategorySummarySubject.next(summary);
  }

  getCategories(): Observable<Category[]> {
    return this._categories$;
  }
}
