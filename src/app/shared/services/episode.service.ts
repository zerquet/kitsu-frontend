import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Episode } from '../models/episode.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private http = inject(HttpClient);  
  private readonly baseUrl = "https://localhost:7009/api/Episode";

  addEpisode(request: Episode): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request);
  }

  getEpisodesByAnimeId(id: number): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(`${this.baseUrl}/${id}`);
  }

  getEpisodes(): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(this.baseUrl);
  }
}
