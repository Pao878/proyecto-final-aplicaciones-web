import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.scss',
})
export class InicioComponent {

  model = {
    email: '',
    password: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  clearError() {
    this.errorMessage = '';
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Llamar al servicio de autenticación
    this.authService.login(this.model.email, this.model.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.isLoading = false;

        // Guardar usuario si viene en la respuesta
        if (response.success && response.usuario) {
          this.authService.saveUser({
             id: response.usuario.id,
            nombre: response.usuario.nombre,
            email: response.usuario.email,
            rol: response.usuario.rol as 'administrador' | 'usuario'
          });

          // Redirigir al home
          this.router.navigate(['/home']);
        } else {
          this.errorMessage = response.mensaje || response.message || 'Error al iniciar sesión';
        }
      },
      error: (error) => {
        console.error('Error de login:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.mensaje ||
                            error.error?.message ||
                            'Credenciales incorrectas. Intenta de nuevo.';
      }
    });
  }
}
