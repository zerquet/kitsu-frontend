import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:7017/api/categories';

  private _categories$ = new BehaviorSubject<Category[]>([]);

  constructor() {
    this.http
      .get<Category[]>(this.baseUrl)
      .subscribe((categories) => {
        this._categories$.next(categories);
      });
  }

  getCategory(name: string): Observable<Category | undefined> {
    return this._categories$.pipe(
      switchMap((categories) => {
        return of(categories.find((category) => category.name === name));
      })
    );
  }

  getCategories(): Observable<Category[]> {
    return this._categories$;
  }
}
