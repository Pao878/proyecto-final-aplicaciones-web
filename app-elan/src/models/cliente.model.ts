export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  direccion?: string;
  ciudad?: string;
  pais?: string;
  fecha_registro?: Date;
}
