export interface Venta {
  id?: number;
  obra_id: number;
  cliente_id: number;
  precio_venta: number;
  fecha_venta: string | Date;
  metodo_pago: 'efectivo' | 'tarjeta' | 'transferencia';
  notas?: string;
  fecha_registro?: Date;
  // Datos adicionales de las relaciones
  obra_titulo?: string;
  cliente_nombre?: string;
}
