// src/app/models/user.model.ts

// Modelo principal del usuario (según tu tabla usuarios)
export interface User {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'administrador' | 'usuario';
  fecha_registro?: Date;
}

// Request para el login (lo que ENVÍAS al backend)
export interface LoginRequest {
  email: string;      // ← Tu backend espera 'email'
  password: string;
}

// Response del login (lo que RECIBES del backend)
export interface LoginResponse {
  success: boolean;
  mensaje?: string;
  message?: string;
  usuario?: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}
