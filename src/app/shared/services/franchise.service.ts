import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Franchise } from '../models/franchise.model';

@Injectable({
  providedIn: 'root'
})
export class FranchiseService {
  private http = inject(HttpClient);
  private readonly baseUrl = "https://localhost:7009/api/Franchise";

  addFranchise(request: Franchise): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request);
  }

  getFranchisesByKeyword(keyword: string): Observable<Franchise[]> {
    return this.http
      .get<Franchise[]>(`${this.baseUrl}/GetByKeyword?keyword=${keyword}`);
  }

  getFranchises(): Observable<Franchise[]> {
    return this.http
      .get<Franchise[]>(this.baseUrl);
  }
}
