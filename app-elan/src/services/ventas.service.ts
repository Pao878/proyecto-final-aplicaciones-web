import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}


  getVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(`${this.apiUrl}/ventas`).pipe(
      switchMap(ventas => {
        if (ventas.length === 0) {
          return new Observable<Venta[]>(observer => {
            observer.next([]);
            observer.complete();
          });
        }

        const obras$ = this.http.get<any[]>(`${this.apiUrl}/obras`);
        const clientes$ = this.http.get<any[]>(`${this.apiUrl}/clientes`);

        return forkJoin([obras$, clientes$]).pipe(
          map(([obras, clientes]): Venta[] => {

            return ventas.map(venta => {
              const obra = obras.find(o => o.id === venta.obra_id);
              const cliente = clientes.find(c => c.id === venta.cliente_id);

              return {
                ...venta,
                obra_titulo: obra ? obra.titulo : `Obra #${venta.obra_id}`,
                cliente_nombre: cliente
                  ? `${cliente.nombre} ${cliente.apellido}`.trim()
                  : `Cliente #${venta.cliente_id}`
              } as Venta;
            });
          })
        );
      })
    );
  }


  getVentaById(id: number): Observable<Venta> {
    return this.http.get<Venta>(`${this.apiUrl}/ventas/${id}`).pipe(
      switchMap(venta => {
        const obra$ = this.http.get<any>(`${this.apiUrl}/obras/${venta.obra_id}`);
        const cliente$ = this.http.get<any>(`${this.apiUrl}/clientes/${venta.cliente_id}`);

        return forkJoin([obra$, cliente$]).pipe(
          map(([obra, cliente]): Venta => ({
            ...venta,
            obra_titulo: obra.titulo,
            cliente_nombre: `${cliente.nombre} ${cliente.apellido}`.trim()
          }))
        );
      })
    );
  }


  createVenta(venta: Venta): Observable<Venta> {
    return this.http.post<Venta>(`${this.apiUrl}/ventas`, venta);
  }

  updateVenta(id: number, venta: Venta): Observable<Venta> {
    return this.http.put<Venta>(`${this.apiUrl}/ventas/${id}`, venta);
  }


  deleteVenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/ventas/${id}`);
  }


  getEstadisticas(): Observable<any> {
    return this.getVentas().pipe(
      map(ventas => {
        const total = ventas.reduce((sum, v) => sum + v.precio_venta, 0);
        const porMetodo = ventas.reduce((acc, v) => {
          acc[v.metodo_pago] = (acc[v.metodo_pago] || 0) + v.precio_venta;
          return acc;
        }, {} as any);

        return {
          totalVentas: ventas.length,
          totalRecaudado: total,
          porMetodoPago: porMetodo
        };
      })
    );
  }
}
