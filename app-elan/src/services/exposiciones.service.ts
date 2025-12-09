import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Exposicion } from '../models/exposicion.model';

@Injectable({
  providedIn: 'root'
})
export class ExposicionesService {
  private apiUrl = 'http://localhost:3000/api/exposiciones';

  constructor(private http: HttpClient) {}

  getExposiciones(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(this.apiUrl);
  }

  getExposicionById(id: number): Observable<Exposicion> {
    return this.http.get<Exposicion>(`${this.apiUrl}/${id}`);
  }

  createExposicion(exposicion: Exposicion): Observable<any> {
    return this.http.post(this.apiUrl, exposicion);
  }

  updateExposicion(id: number, exposicion: Exposicion): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, exposicion);
  }

  deleteExposicion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getExposicionesConObras(): Observable<Exposicion[]> {
    return this.http.get<Exposicion[]>(`${this.apiUrl}/con-obras`);
  }
}
