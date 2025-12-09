export interface Exposicion {
  id?: number;
  titulo: string;
  descripcion?: string;
  fecha_inicio: string | Date;
  fecha_fin: string | Date;
  ubicacion?: string;
  curador?: string;
  imagen?: string;
  estado?: 'programada' | 'activa' | 'finalizada';
  fecha_creacion?: Date;
  obra_ids?: string;
  obra_titulos?: string;
}
