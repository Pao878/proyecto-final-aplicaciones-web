import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExposicionesService } from '../../services/exposiciones.service';
import { Exposicion } from '../../models/exposicion.model';

// Enum para los modos de acción
enum ModoAccion {
  AGREGAR = 'agregar',
  EDITAR = 'editar',
  ELIMINAR = 'eliminar',
  VER = 'ver'
}

@Component({
  selector: 'app-exposiciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exposiciones.html',
  styleUrls: ['./exposiciones.scss']
})
export class ExposicionesComponent implements OnInit {
  // Hacer el enum accesible en el template
  ModoAccion = ModoAccion;

  exposiciones: Exposicion[] = [];
  exposicionesFiltradas: Exposicion[] = [];
  exposicionSeleccionada: Exposicion | null = null;

  cargando = false;
  error = '';
  busqueda = '';

  // Modo actual de operación
  modoActual: ModoAccion | null = null;
  modoSeleccion = false;
  soloLectura = false;

  // Modal
  mostrarModal = false;

  constructor(private exposicionesService: ExposicionesService) {}

  ngOnInit() {
    this.cargarExposiciones();
  }

  // ============ CARGA DE DATOS ============

  cargarExposiciones() {
    this.cargando = true;
    this.error = '';

    this.exposicionesService.getExposiciones().subscribe({
      next: (data) => {
        this.exposiciones = data;
        this.exposicionesFiltradas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las exposiciones';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // ============ BÚSQUEDA Y FILTRADO ============

  filtrarExposiciones() {
    if (!this.busqueda.trim()) {
      this.exposicionesFiltradas = this.exposiciones;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.exposicionesFiltradas = this.exposiciones.filter(exposicion =>
      exposicion.titulo?.toLowerCase().includes(termino) ||
      exposicion.descripcion?.toLowerCase().includes(termino) ||
      exposicion.ubicacion?.toLowerCase().includes(termino) ||
      exposicion.curador?.toLowerCase().includes(termino)
    );
  }

  // ============ GESTIÓN DE MODOS ============

  setModoAccion(modo: ModoAccion) {
    if (this.modoActual === modo) {
      this.cancelarAccion();
      return;
    }

    this.modoActual = modo;

    switch (modo) {
      case ModoAccion.AGREGAR:
        this.abrirModalAgregar();
        break;
      case ModoAccion.EDITAR:
      case ModoAccion.ELIMINAR:
        this.modoSeleccion = true;
        this.exposicionSeleccionada = null;
        break;
    }
  }

  cancelarAccion() {
    this.modoActual = null;
    this.modoSeleccion = false;
    this.exposicionSeleccionada = null;
  }

  get mensajeAccion(): string {
    switch (this.modoActual) {
      case ModoAccion.EDITAR:
        return 'Selecciona una exposición para editar';
      case ModoAccion.ELIMINAR:
        return 'Selecciona una exposición para eliminar';
      default:
        return '';
    }
  }

  // ============ MODAL ============

  abrirModalAgregar() {
    this.exposicionSeleccionada = this.crearExposicionVacia();
    this.soloLectura = false;
    this.mostrarModal = true;
    this.modoSeleccion = false;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.exposicionSeleccionada = null;
    this.soloLectura = false;
    if (this.modoActual !== ModoAccion.EDITAR && this.modoActual !== ModoAccion.ELIMINAR) {
      this.modoActual = null;
    }
  }

  // ============ SELECCIÓN DE EXPOSICIÓN ============

  seleccionarExposicion(exposicion: Exposicion) {
    // Si no hay modo activo, solo ver detalle
    if (!this.modoActual) {
      this.verDetalle(exposicion);
      return;
    }

    // Si no está en modo selección, ignorar
    if (!this.modoSeleccion) {
      return;
    }

    this.exposicionSeleccionada = { ...exposicion };

    switch (this.modoActual) {
      case ModoAccion.EDITAR:
        this.soloLectura = false;
        this.mostrarModal = true;
        this.modoSeleccion = false;
        break;
      case ModoAccion.ELIMINAR:
        this.confirmarEliminar();
        break;
    }
  }

  verDetalle(exposicion: Exposicion) {
    this.exposicionSeleccionada = { ...exposicion };
    this.soloLectura = true;
    this.modoActual = ModoAccion.VER;
    this.mostrarModal = true;
  }

  // ============ OPERACIONES CRUD ============

  guardarExposicion() {
    if (!this.validarExposicion()) {
      return;
    }

    this.cargando = true;

    if (this.modoActual === ModoAccion.AGREGAR) {
      this.exposicionesService.createExposicion(this.exposicionSeleccionada!).subscribe({
        next: () => {
          alert('Exposición agregada exitosamente');
          this.cerrarModal();
          this.cargarExposiciones();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al agregar la exposición');
          console.error(err);
          this.cargando = false;
        }
      });
    } else if (this.modoActual === ModoAccion.EDITAR && this.exposicionSeleccionada?.id) {
      this.exposicionesService.updateExposicion(this.exposicionSeleccionada.id, this.exposicionSeleccionada).subscribe({
        next: () => {
          alert('Exposición actualizada exitosamente');
          this.cerrarModal();
          this.cargarExposiciones();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al actualizar la exposición');
          console.error(err);
          this.cargando = false;
        }
      });
    }
  }

  confirmarEliminar() {
    if (!this.exposicionSeleccionada || !this.exposicionSeleccionada.id) {
      return;
    }

    const confirmar = confirm(
      `¿Estás seguro de eliminar la exposición "${this.exposicionSeleccionada.titulo}"?`
    );

    if (confirmar) {
      this.cargando = true;
      this.exposicionesService.deleteExposicion(this.exposicionSeleccionada.id).subscribe({
        next: () => {
          alert('Exposición eliminada exitosamente');
          this.cancelarAccion();
          this.cargarExposiciones();
        },
        error: (err) => {
          alert('Error al eliminar la exposición');
          console.error(err);
          this.cargando = false;
          this.cancelarAccion();
        }
      });
    } else {
      this.cancelarAccion();
    }
  }

  // ============ VALIDACIONES ============

  validarExposicion(): boolean {
    if (!this.exposicionSeleccionada) {
      return false;
    }

    if (!this.exposicionSeleccionada.titulo?.trim()) {
      alert('El título es obligatorio');
      return false;
    }

    if (!this.exposicionSeleccionada.fecha_inicio) {
      alert('La fecha de inicio es obligatoria');
      return false;
    }

    if (!this.exposicionSeleccionada.fecha_fin) {
      alert('La fecha de fin es obligatoria');
      return false;
    }

    // Validar que la fecha de fin sea posterior a la de inicio
    const fechaInicio = new Date(this.exposicionSeleccionada.fecha_inicio);
    const fechaFin = new Date(this.exposicionSeleccionada.fecha_fin);

    if (fechaFin <= fechaInicio) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }

    return true;
  }

  // ============ UTILIDADES ============

  crearExposicionVacia(): Exposicion {
    return {
      titulo: '',
      descripcion: '',
      fecha_inicio: '',
      fecha_fin: '',
      ubicacion: '',
      curador: '',
      imagen: '',
      estado: 'programada'
    };
  }

  getImagenUrl(nombreImagen: string | undefined): string {
    if (!nombreImagen) {
      return 'assets/imagenes/default-exhibition.jpg';
    }
    if (nombreImagen.startsWith('http') || nombreImagen.startsWith('assets/')) {
      return nombreImagen;
    }
    return `assets/imagenes/${nombreImagen}`;
  }

  isExposicionActiva(exposicion: Exposicion): boolean {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const inicio = new Date(exposicion.fecha_inicio);
    const fin = new Date(exposicion.fecha_fin);

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);

    return hoy >= inicio && hoy <= fin;
  }

  formatearFecha(fecha: string | Date | undefined): string {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
