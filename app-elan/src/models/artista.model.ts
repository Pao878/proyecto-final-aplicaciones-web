export interface Artista {
  id?: number;
  nombre: string;
  apellido: string;
  nacionalidad?: string;
  fecha_nacimiento?: string | Date;
  biografia?: string;
  imagen?: string;
  email?: string;
  telefono?: string;
  fecha_registro?: Date;
}
