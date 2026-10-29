import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { AnimeDetail } from '../../../shared/models/anime.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GetAnimeByIdResponseDto } from '../dtos/get-anime-by-id-response.dto';
import { mapAddAnimeToAnimeTableItem, mapAnimeTableResponseItemToAnimeTableItem, mapGetAnimeByIdToAnimeDetail, mapUpdateAnimeToAnimeTableItem } from '../../../shared/mappers/admin.mapper';
import { AnimeTableResponseItemDto } from '../dtos/anime-table-response-item.dto';
import { mapAnimeResponseItemToAnime } from '../../../shared/mappers/anime.mapper';
import { AnimeTableItem } from '../models/anime-table-item.model';
import { UpdateAnimeResponseDto } from '../dtos/update-anime-response.dto';
import { AddAnimeResponseDto } from '../dtos/add-anime-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;
  private _animes$ = new BehaviorSubject<AnimeTableItem[]>([]); //STATE
  animes$ = this._animes$.asObservable();
  
  constructor() {
    this.http.get<AnimeTableResponseItemDto[]>(`${this.baseUrl}/animes`)
      .pipe(map(animes => {
        return animes.map(mapAnimeTableResponseItemToAnimeTableItem)
      }))
      .subscribe((animes) => {
        this._animes$.next(animes)
      });
  }

  getAnimeById(animeId: number): Observable<AnimeDetail> {  
    return this.http.get<GetAnimeByIdResponseDto>(`${this.baseUrl}/animes/${animeId}`)
      .pipe(map(mapGetAnimeByIdToAnimeDetail));
  }

  addAnime(req: FormData) {
    return this.http.post<AddAnimeResponseDto>(`${this.baseUrl}/animes`, req)
      .pipe(
        map(mapAddAnimeToAnimeTableItem),
        tap((anime) => this._animes$.next([...this._animes$.getValue(), anime]))
      );
  }

  updateAnime(req: FormData) {    
    return this.http.put<UpdateAnimeResponseDto>(`${this.baseUrl}/animes`, req)
      .pipe(
        map(mapUpdateAnimeToAnimeTableItem),
        tap((anime) => this.applyAnimeUpdates(anime))
      );
  }

  private applyAnimeUpdates(anime: AnimeTableItem) {
    console.log(this._animes$);
    
    console.log(anime);
    const animes = this._animes$.getValue();
    
    const idx = animes.findIndex((a) => a.id === anime.id);

    if (idx !== -1) {
      animes[idx] = anime;
      this._animes$.next([...animes]);
    }
  }
}
