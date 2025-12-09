import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ObrasService } from '../../services/obras.service';
import { ArtistasService } from '../../services/artistas.service';
import { Obra } from '../../models/obra.model';
import { Artista } from '../../models/artista.model';


enum ModoAccion {
  AGREGAR = 'agregar',
  EDITAR = 'editar',
  ELIMINAR = 'eliminar',
  VER = 'ver'
}

@Component({
  selector: 'app-obras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './obras.html',
  styleUrls: ['./obras.scss']
})
export class ObrasComponent implements OnInit {

  ModoAccion = ModoAccion;

  obras: Obra[] = [];
  artistas: Artista[] = [];
  obrasFiltradas: Obra[] = [];
  obraSeleccionada: Obra | null = null;

  cargando = false;
  error = '';
  busqueda = '';


  modoActual: ModoAccion | null = null;
  modoSeleccion = false;
  soloLectura = false;


  mostrarModal = false;

  constructor(
    private obrasService: ObrasService,
    private artistasService: ArtistasService
  ) {}

  ngOnInit() {
    this.cargarObras();
    this.cargarArtistas();
  }

  // CARGA DE DATOS

  cargarObras() {
    this.cargando = true;
    this.error = '';

    this.obrasService.getObras().subscribe({
      next: (data) => {
        this.obras = data;
        this.obrasFiltradas = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las obras';
        console.error(err);
        this.cargando = false;
      }
    });
  }

  cargarArtistas() {
    this.artistasService.getArtistas().subscribe({
      next: (data) => {
        this.artistas = data;
      },
      error: (err) => {
        console.error('Error al cargar artistas:', err);
      }
    });
  }

  // BÚSQUEDA Y FILTRADO

  filtrarObras() {
    if (!this.busqueda.trim()) {
      this.obrasFiltradas = this.obras;
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.obrasFiltradas = this.obras.filter(obras =>
      obras.titulo.toLowerCase().includes(termino) ||
      obras.descripcion?.toLowerCase().includes(termino) ||
      obras.nombre_artista?.toLowerCase().includes(termino) ||
      obras.tecnica?.toLowerCase().includes(termino)
    );
  }

  //  MODOS

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
        this.obraSeleccionada = null;
        break;
    }
  }

  cancelarAccion() {
    this.modoActual = null;
    this.modoSeleccion = false;
    this.obraSeleccionada = null;
  }

  get mensajeAccion(): string {
    switch (this.modoActual) {
      case ModoAccion.EDITAR:
        return 'Selecciona una obra para editar';
      case ModoAccion.ELIMINAR:
        return 'Selecciona una obra para eliminar';
      default:
        return '';
    }
  }

  abrirModalAgregar() {
    this.obraSeleccionada = this.crearObraVacia();
    this.soloLectura = false;
    this.mostrarModal = true;
    this.modoSeleccion = false;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.obraSeleccionada = null;
    this.soloLectura = false;
    if (this.modoActual !== ModoAccion.EDITAR && this.modoActual !== ModoAccion.ELIMINAR) {
      this.modoActual = null;
    }
  }

  // SELECCIÓN DE OBRA

  seleccionarObra(obra: Obra) {
    // Si no hay modo activo, solo ver detalle
    if (!this.modoActual) {
      this.verDetalle(obra);
      return;
    }

    // Si no está en modo selección, ignorar
    if (!this.modoSeleccion) {
      return;
    }

    this.obraSeleccionada = { ...obra };

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

  verDetalle(obra: Obra) {
    this.obraSeleccionada = { ...obra };
    this.soloLectura = true;
    this.modoActual = ModoAccion.VER;
    this.mostrarModal = true;
  }

  // CRUD

  guardarObra() {
    if (!this.validarObra()) {
      return;
    }

    this.cargando = true;

    if (this.modoActual === ModoAccion.AGREGAR) {
      this.obrasService.createObra(this.obraSeleccionada!).subscribe({
        next: () => {
          alert('Obra agregada exitosamente');
          this.cerrarModal();
          this.cargarObras();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al agregar la obra');
          console.error(err);
          this.cargando = false;
        }
      });
    } else if (this.modoActual === ModoAccion.EDITAR && this.obraSeleccionada?.id) {
      this.obrasService.updateObra(this.obraSeleccionada.id, this.obraSeleccionada).subscribe({
        next: () => {
          alert('Obra actualizada exitosamente');
          this.cerrarModal();
          this.cargarObras();
          this.cancelarAccion();
        },
        error: (err) => {
          alert('Error al actualizar la obra');
          console.error(err);
          this.cargando = false;
        }
      });
    }
  }

  confirmarEliminar() {
    if (!this.obraSeleccionada || !this.obraSeleccionada.id) {
      return;
    }

    const confirmar = confirm(
      `¿Estás seguro de eliminar la obra "${this.obraSeleccionada.titulo}"?`
    );

    if (confirmar) {
      this.cargando = true;
      this.obrasService.deleteObra(this.obraSeleccionada.id).subscribe({
        next: () => {
          alert('Obra eliminada exitosamente');
          this.cancelarAccion();
          this.cargarObras();
        },
        error: (err) => {
          alert('Error al eliminar la obra. Puede que esté asociada a una venta o exposición.');
          console.error(err);
          this.cargando = false;
          this.cancelarAccion();
        }
      });
    } else {
      this.cancelarAccion();
    }
  }

  //VALIDACIONES

  validarObra(): boolean {
    if (!this.obraSeleccionada) {
      return false;
    }

    if (!this.obraSeleccionada.titulo?.trim()) {
      alert('El título es obligatorio');
      return false;
    }

    if (!this.obraSeleccionada.artista_id) {
      alert('Debes seleccionar un artista');
      return false;
    }

    if (!this.obraSeleccionada.tecnica?.trim()) {
      alert('La técnica es obligatoria');
      return false;
    }

    if (!this.obraSeleccionada.imagen?.trim()) {
      alert('La URL de la imagen es obligatoria');
      return false;
    }

    return true;
  }

  // UTILIDADES
  crearObraVacia(): Obra {
    return {
      titulo: '',
      artista_id: undefined,
      descripcion: '',
      tecnica: '',
      dimensiones: '',
      anio: new Date().getFullYear(),
      precio: 0,
      estado: 'disponible',
      imagen: ''
    };
  }

  getNombreArtista(artista_id: number | undefined): string {
    if (!artista_id) return 'Sin artista';
    const artista = this.artistas.find(a => a.id === artista_id);
    return artista ? `${artista.nombre} ${artista.apellido}` : 'Desconocido';
  }

  getEstadoBadgeClass(estado: string | undefined): string {
    const clases: { [key: string]: string } = {
      'disponible': 'badge-success',
      'vendida': 'badge-danger',
      'reservada': 'badge-warning',
      'en_exposicion': 'badge-info'
    };
    return clases[estado || 'disponible'] || 'badge-secondary';
  }

  getEstadoTexto(estado: string | undefined): string {
    const textos: { [key: string]: string } = {
      'disponible': 'Disponible',
      'vendida': 'Vendida',
      'reservada': 'Reservada',
      'en_exposicion': 'En Exposición'
    };
    return textos[estado || 'disponible'] || estado || 'Disponible';
  }

  // MÉTODO PARA CONSTRUIR URL DE IMAGEN
  getImagenUrl(nombreImagen: string | undefined): string {
    if (!nombreImagen) {
      return 'assets/imagenes/default.jpg';
    }
    // Si ya tiene la ruta completa (http o assets/), devolverla tal cual
    if (nombreImagen.startsWith('http') || nombreImagen.startsWith('assets/')) {
      return nombreImagen;
    }
    // Si solo es el nombre del archivo, construir la ruta completa
    return `assets/imagenes/${nombreImagen}`;
  }
}
