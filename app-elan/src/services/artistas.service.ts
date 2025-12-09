import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Artista } from '../models/artista.model';

@Injectable({
  providedIn: 'root'
})
export class ArtistasService {
  private apiUrl = 'http://localhost:3000/api/artistas';

  constructor(private http: HttpClient) {}

  getArtistas(): Observable<Artista[]> {
    return this.http.get<Artista[]>(this.apiUrl);
  }

  getArtistaById(id: number): Observable<Artista> {
    return this.http.get<Artista>(`${this.apiUrl}/${id}`);
  }

  createArtista(artista: Artista): Observable<any> {
    return this.http.post(this.apiUrl, artista);
  }

  updateArtista(id: number, artista: Artista): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, artista);
  }

  deleteArtista(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
