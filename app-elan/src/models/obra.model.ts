export interface Obra {
  id?: number;
  titulo: string;
  artista_id?: number;
  nombre_artista?: string;
  artista_apellido?: string;
  descripcion?: string;
  tecnica?: string;
  dimensiones?: string;
  anio?: number;
  precio?: number;
  estado?: 'disponible' | 'vendida' | 'reservada' | 'en_exposicion';
  imagen?: string;
  fecha_ingreso?: Date;
}
