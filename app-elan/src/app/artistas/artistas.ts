import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistasService } from '../../services/artistas.service';
import { Artista } from '../../models/artista.model';

// Enum para los modos de acción
enum ModoAccion {
  AGREGAR = 'agregar',
  EDITAR = 'editar',
  ELIMINAR = 'eliminar',
  VER = 'ver'
}

@Component({
  selector: 'app-artistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './artistas.html',
  styleUrls: ['./artistas.scss']
})
export class ArtistasComponent implements OnInit {

  ModoAccion = ModoAccion;

  artistas: Artista[] = [];
  artistasFiltrados: Artista[] = [];
  artistaSeleccionado: Artista | null = null;

  cargando = false;
  error = '';
  busqueda = '';


  modoActual: ModoAccion | null = null;
  modoSeleccion = false;
  soloLectura = false;


  mostrarModal = false;

  constructor(private artistasService: ArtistasService) {}

  ngOnInit() {
    this.cargarArtistas();
  }

  //  CARGA DE DATOS

  cargarArtistas() {
    this.cargando = true;
    this.error = '';

    this.artistasService.getArtistas().subscribe({
      next: (data) => {
        this.artistas = data;
        this.artistasFiltrados = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los artistas';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  // BÚSQUEDA Y FILTRADO

  filtrarArtistas() {
    if (!this.busqueda.trim()) {
      this.artistasFiltrados = this.artistas;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.artistasFiltrados = this.artistas.filter(artista =>
      artista.nombre.toLowerCase().includes(termino) ||
      artista.apellido?.toLowerCase().includes(termino) ||
      artista.nacionalidad?.toLowerCase().includes(termino) ||
      artista.biografia?.toLowerCase().includes(termino)
    );
  }

  // GESTIÓN DE MODOS

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
        this.artistaSeleccionado = null;
        break;
    }
  }

  cancelarAccion() {
    this.modoActual = null;
    this.modoSeleccion = false;
    this.artistaSeleccionado = null;
  }

  get mensajeAccion(): string {
    switch (this.modoActual) {
      case ModoAccion.EDITAR:
        return 'Selecciona un artista para editar';
      case ModoAccion.ELIMINAR:
        return 'Selecciona un artista para eliminar';
      default:
        return '';
    }
  }

  abrirModalAgregar() {
    this.artistaSeleccionado = this.crearArtistaVacio();
    this.soloLectura = false;
    this.mostrarModal = true;
    this.modoSeleccion = false;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.artistaSeleccionado = null;
    this.soloLectura = false;
    if (this.modoActual !== ModoAccion.EDITAR && this.modoActual !== ModoAccion.ELIMINAR) {
      this.modoActual = null;
    }
  }

  //  SELECCIÓN DE ARTISTA

  seleccionarArtista(artista: Artista) {
    // Si no hay modo activo, solo ver detalle
    if (!this.modoActual) {
      this.verDetalle(artista);
      return;
    }

    // Si no está en modo selección, ignorar
    if (!this.modoSeleccion) {
      return;
    }

    this.artistaSeleccionado = { ...artista };

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

  verDetalle(artista: Artista) {
    this.artistaSeleccionado = { ...artista };
    this.soloLectura = true;
    this.modoActual = ModoAccion.VER;
    this.mostrarModal = true;
  }

  //  OPERACIONES CRUD

  guardarArtista() {
    if (!this.validarArtista()) {
      return;
    }

    this.cargando = true;

    if (this.modoActual === ModoAccion.AGREGAR) {
      this.artistasService.createArtista(this.artistaSeleccionado!).subscribe({
        next: () => {
          alert('Artista agregado exitosamente');
          this.cerrarModal();
          this.cargarArtistas();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al agregar el artista');
          console.error(err);
          this.cargando = false;
        }
      });
    } else if (this.modoActual === ModoAccion.EDITAR && this.artistaSeleccionado?.id) {
      this.artistasService.updateArtista(this.artistaSeleccionado.id, this.artistaSeleccionado).subscribe({
        next: () => {
          alert('Artista actualizado exitosamente');
          this.cerrarModal();
          this.cargarArtistas();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al actualizar el artista');
          console.error(err);
          this.cargando = false;
        }
      });
    }
  }

  confirmarEliminar() {
    if (!this.artistaSeleccionado || !this.artistaSeleccionado.id) {
      return;
    }

    const confirmar = confirm(
      `¿Estás seguro de eliminar al artista "${this.artistaSeleccionado.nombre} ${this.artistaSeleccionado.apellido}"?`
    );

    if (confirmar) {
      this.cargando = true;
      this.artistasService.deleteArtista(this.artistaSeleccionado.id).subscribe({
        next: () => {
          alert('Artista eliminado exitosamente');
          this.cancelarAccion();
          this.cargarArtistas();
        },
        error: (err) => {
          alert('Error al eliminar el artista. Puede que tenga obras asociadas.');
          console.error(err);
          this.cargando = false;
          this.cancelarAccion();
        }
      });
    } else {
      this.cancelarAccion();
    }
  }

  // VALIDACIONES

  validarArtista(): boolean {
    if (!this.artistaSeleccionado) {
      return false;
    }

    if (!this.artistaSeleccionado.nombre?.trim()) {
      alert('El nombre es obligatorio');
      return false;
    }

    if (!this.artistaSeleccionado.apellido?.trim()) {
      alert('El apellido es obligatorio');
      return false;
    }

    return true;
  }

  //  UTILIDADES

  crearArtistaVacio(): Artista {
    return {
      nombre: '',
      apellido: '',
      nacionalidad: '',
      fecha_nacimiento: '',
      biografia: '',
      email: '',
      telefono: '',
      imagen: ''
    };
  }

  // CONSTRUIR URL DE IMAGEN
  getImagenUrl(nombreImagen: string | undefined): string {
    if (!nombreImagen) {
      return 'assets/imagenes/default-artist.jpg';
  }

    if (nombreImagen.startsWith('http') || nombreImagen.startsWith('assets/')) {
      return nombreImagen;
    }
    return `assets/imagenes/${nombreImagen}`;
  }

  // Calcular edad si tiene fecha de nacimiento
  calcularEdad(fecha_nacimiento: string | Date | undefined): number | null {
    if (!fecha_nacimiento) return null;
    const hoy = new Date();
    const nacimiento = new Date(fecha_nacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
