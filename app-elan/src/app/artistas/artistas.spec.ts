import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ArtistasComponent } from './artistas/artistas';
import { ArtistasService } from '../../services/artistas.service';
import { of } from 'rxjs';

describe('ArtistasComponent', () => {
  let component: ArtistasComponent;
  let fixture: ComponentFixture<ArtistasComponent>;
  let artistasService: jasmine.SpyObj<ArtistasService>;

  beforeEach(async () => {
    const artistasServiceSpy = jasmine.createSpyObj('ArtistasService', [
      'getArtistas',
      'createArtista',
      'updateArtista',
      'deleteArtista'
    ]);

    await TestBed.configureTestingModule({
      imports: [
        ArtistasComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ArtistasService, useValue: artistasServiceSpy }
      ]
    })
    .compileComponents();

    artistasService = TestBed.inject(ArtistasService) as jasmine.SpyObj<ArtistasService>;

    artistasService.getArtistas.and.returnValue(of([]));

    fixture = TestBed.createComponent(ArtistasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load artistas on init', () => {
    expect(artistasService.getArtistas).toHaveBeenCalled();
  });

  it('should activate add mode', () => {
    component.setModoAccion(component.ModoAccion.AGREGAR);
    expect(component.modoActual).toBe('agregar');
    expect(component.mostrarModal).toBe(true);
  });

  it('should activate edit mode', () => {
    component.setModoAccion(component.ModoAccion.EDITAR);
    expect(component.modoActual).toBe('editar');
    expect(component.modoSeleccion).toBe(true);
  });

  it('should activate delete mode', () => {
    component.setModoAccion(component.ModoAccion.ELIMINAR);
    expect(component.modoActual).toBe('eliminar');
    expect(component.modoSeleccion).toBe(true);
  });

  it('should cancel action', () => {
    component.modoActual = component.ModoAccion.EDITAR;
    component.cancelarAccion();
    expect(component.modoActual).toBeNull();
    expect(component.modoSeleccion).toBe(false);
  });

  it('should filter artistas by search term', () => {
    component.artistas = [
      {
        id: 1,
        nombre: 'Diego',
        apellido: 'Rivera',
        nacionalidad: 'Mexicano',
        biografia: 'Pintor y muralista mexicano',
        fecha_nacimiento: '1886-12-08',
        email: 'diego@test.com',
        telefono: '+52 123 456 7890',
        imagen: 'artista1.jpg'
      },
      {
        id: 2,
        nombre: 'Frida',
        apellido: 'Kahlo',
        nacionalidad: 'Mexicana',
        biografia: 'Pintora mexicana',
        fecha_nacimiento: '1907-07-06',
        email: 'frida@test.com',
        telefono: '+52 234 567 8901',
        imagen: 'artista2.jpg'
      }
    ];
    component.artistasFiltrados = [...component.artistas];
    component.busqueda = 'Diego';
    component.filtrarArtistas();

    expect(component.artistasFiltrados.length).toBe(1);
    expect(component.artistasFiltrados[0].nombre).toBe('Diego');
  });

  it('should validate artista correctly - missing nombre', () => {
    component.artistaSeleccionado = {
      nombre: '',
      apellido: 'Rivera',
      nacionalidad: 'Mexicano',
      biografia: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      imagen: ''
    };
    expect(component.validarArtista()).toBe(false);
  });

  it('should validate artista correctly - missing apellido', () => {
    component.artistaSeleccionado = {
      nombre: 'Diego',
      apellido: '',
      nacionalidad: 'Mexicano',
      biografia: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      imagen: ''
    };
    expect(component.validarArtista()).toBe(false);
  });

  it('should validate artista correctly - valid artista', () => {
    component.artistaSeleccionado = {
      nombre: 'Diego',
      apellido: 'Rivera',
      nacionalidad: 'Mexicano',
      biografia: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      imagen: ''
    };
    expect(component.validarArtista()).toBe(true);
  });

  it('should close modal', () => {
    component.mostrarModal = true;
    component.cerrarModal();
    expect(component.mostrarModal).toBe(false);
    expect(component.artistaSeleccionado).toBeNull();
  });

  it('should get imagen url correctly - with filename', () => {
    const url = component.getImagenUrl('artista1.jpg');
    expect(url).toBe('assets/imagenes/artista1.jpg');
  });

  it('should get imagen url correctly - with full path', () => {
    const url = component.getImagenUrl('assets/imagenes/artista1.jpg');
    expect(url).toBe('assets/imagenes/artista1.jpg');
  });

  it('should get imagen url correctly - with http url', () => {
    const url = component.getImagenUrl('https://example.com/artista.jpg');
    expect(url).toBe('https://example.com/artista.jpg');
  });

  it('should get imagen url correctly - undefined imagen', () => {
    const url = component.getImagenUrl(undefined);
    expect(url).toBe('assets/imagenes/default-artist.jpg');
  });

  it('should calculate age correctly', () => {
    const fechaNacimiento = new Date();
    fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - 30);
    const edad = component.calcularEdad(fechaNacimiento.toISOString().split('T')[0]);
    expect(edad).toBe(30);
  });

  it('should return null for undefined fecha_nacimiento', () => {
    const edad = component.calcularEdad(undefined);
    expect(edad).toBeNull();
  });

  it('should create empty artista', () => {
    const artista = component.crearArtistaVacio();
    expect(artista.nombre).toBe('');
    expect(artista.apellido).toBe('');
    expect(artista.nacionalidad).toBe('');
  });

  it('should set mensaje accion for edit mode', () => {
    component.modoActual = component.ModoAccion.EDITAR;
    expect(component.mensajeAccion).toBe('Selecciona un artista para editar');
  });

  it('should set mensaje accion for delete mode', () => {
    component.modoActual = component.ModoAccion.ELIMINAR;
    expect(component.mensajeAccion).toBe('Selecciona un artista para eliminar');
  });

  it('should return empty string for mensaje accion when no mode active', () => {
    component.modoActual = null;
    expect(component.mensajeAccion).toBe('');
  });

  it('should select artista in view mode when no modo actual', () => {
    const artista = {
      id: 1,
      nombre: 'Diego',
      apellido: 'Rivera',
      nacionalidad: 'Mexicano',
      biografia: '',
      fecha_nacimiento: '',
      email: '',
      telefono: '',
      imagen: ''
    };

    component.modoActual = null;
    component.seleccionarArtista(artista);

    expect(component.modoActual).toBe(component.ModoAccion.VER);
    expect(component.mostrarModal).toBe(true);
    expect(component.soloLectura).toBe(true);
  });

  it('should toggle mode off when clicking same mode twice', () => {
    component.setModoAccion(component.ModoAccion.EDITAR);
    expect(component.modoActual).toBe('editar');

    component.setModoAccion(component.ModoAccion.EDITAR);
    expect(component.modoActual).toBeNull();
  });
});
