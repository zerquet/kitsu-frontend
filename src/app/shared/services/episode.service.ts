import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Episode } from '../models/episode.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {
  private http = inject(HttpClient);  
  private readonly baseUrl = `${environment.apiUrl}/episodes`;
  private readonly baseUrl0 = `${environment.apiUrl}/anime`
  //TODO add state
  addEpisode(request: Episode): Observable<void> {
    return this.http
      .post<void>(this.baseUrl, request);
  }

  getEpisodesByAnimeId(id: number): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(`${this.baseUrl0}/${id}/episodes`);
  }

  getEpisodes(): Observable<Episode[]> {
    return this.http
      .get<Episode[]>(this.baseUrl);
  }
}
