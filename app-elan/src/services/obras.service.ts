// src/app/services/obras.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Obra } from '../models/obra.model';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private apiUrl = 'http://localhost:3000/api/obras';

  constructor(private http: HttpClient) { }


  getObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.apiUrl).pipe(
      retry(2),
      catchError(this.handleError)
    );
  }

  getObraById(id: number): Observable<Obra> {
    return this.http.get<Obra>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createObra(obra: Obra): Observable<Obra> {
    return this.http.post<Obra>(this.apiUrl, obra).pipe(
      catchError(this.handleError)
    );
  }

  updateObra(id: number, obra: Obra): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, obra).pipe(
      catchError(this.handleError)
    );
  }

  deleteObra(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  buscarObras(termino: string): Observable<Obra[]> {
    return this.http.get<Obra[]>(`${this.apiUrl}/buscar/${termino}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Código: ${error.status}\nMensaje: ${error.message}`;
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
