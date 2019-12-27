import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG } from './services.module';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, pluck, switchMap } from 'rxjs/internal/operators';
import { SongSheet, Song } from './data-types/common.types';
import { SongService } from './songservice';

@Injectable({
  providedIn: ServicesModule
})
export class SheetService {

  constructor(private http: HttpClient, private songService: SongService, @Inject(API_CONFIG) private url: string) { }

  getSongSheetDetail(id: number): Observable<SongSheet> {
    // console.log("getSongSheetDetail id:,",id);
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(this.url + 'playlist/detail', { params })
      .pipe(map((res: { playlist: SongSheet }) => res.playlist));
  }

  playSheet(id: number): Observable<Song[]> {
    // console.log("playSheet id:,",id);
    return this.getSongSheetDetail(id).pipe(pluck('tracks'), switchMap(tracks => this.songService.getSongList(tracks)))
  }
}
