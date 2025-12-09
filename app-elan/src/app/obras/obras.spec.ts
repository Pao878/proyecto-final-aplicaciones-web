import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ObrasComponent } from './obras.obras';
import { ObrasService } from '../../services/obras.service';
import { ArtistasService } from '../../services/artistas.service';
import { of } from 'rxjs';

describe('ObrasComponent', () => {
  let component: ObrasComponent;
  let fixture: ComponentFixture<ObrasComponent>;
  let obrasService: jasmine.SpyObj<ObrasService>;
  let artistasService: jasmine.SpyObj<ArtistasService>;

  beforeEach(async () => {
    const obrasServiceSpy = jasmine.createSpyObj('ObrasService', ['getObras', 'createObra', 'updateObra', 'deleteObra']);
    const artistasServiceSpy = jasmine.createSpyObj('ArtistasService', ['getArtistas']);

    await TestBed.configureTestingModule({
      imports: [
        ObrasComponent,
        HttpClientTestingModule,
        FormsModule
      ],
      providers: [
        { provide: ObrasService, useValue: obrasServiceSpy },
        { provide: ArtistasService, useValue: artistasServiceSpy }
      ]
    })
    .compileComponents();

    obrasService = TestBed.inject(ObrasService) as jasmine.SpyObj<ObrasService>;
    artistasService = TestBed.inject(ArtistasService) as jasmine.SpyObj<ArtistasService>;

    obrasService.getObras.and.returnValue(of([]));
    artistasService.getArtistas.and.returnValue(of([]));

    fixture = TestBed.createComponent(ObrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load obras on init', () => {
    expect(obrasService.getObras).toHaveBeenCalled();
  });

  it('should load artistas on init', () => {
    expect(artistasService.getArtistas).toHaveBeenCalled();
  });

  it('should activate add mode', () => {
    component.activarModoAgregar();
    expect(component.modoActual).toBe('agregar');
    expect(component.mostrarModal).toBe(true);
  });

  it('should activate edit mode', () => {
    component.activarModoEditar();
    expect(component.modoActual).toBe('editar');
    expect(component.esperandoSeleccion).toBe(true);
  });

  it('should activate delete mode', () => {
    component.activarModoEliminar();
    expect(component.modoActual).toBe('eliminar');
    expect(component.esperandoSeleccion).toBe(true);
  });

  it('should cancel action', () => {
    component.modoActual = 'editar';
    component.cancelarAccion();
    expect(component.modoActual).toBeNull();
    expect(component.esperandoSeleccion).toBe(false);
  });

  it('should filter obras by search term', () => {
    component.obras = [
      { id: 1, titulo: 'Obra 1', artista_nombre: 'Artista 1', precio: 1000 },
      { id: 2, titulo: 'Obra 2', artista_nombre: 'Artista 2', precio: 2000 }
    ];
    component.obrasFiltradas = [...component.obras];
    component.searchTerm = 'Obra 1';
    component.buscarObras();

    expect(component.obrasFiltradas.length).toBe(1);
    expect(component.obrasFiltradas[0].titulo).toBe('Obra 1');
  });

  it('should validate obra correctly', () => {
    component.nuevaObra = {
      titulo: '',
      artista_id: 1,
      precio: 100
    };
    expect(component.validarObra()).toBe(false);

    component.nuevaObra.titulo = 'Test';
    expect(component.validarObra()).toBe(true);
  });

  it('should close modal', () => {
    component.mostrarModal = true;
    component.cerrarModal();
    expect(component.mostrarModal).toBe(false);
    expect(component.modoActual).toBeNull();
  });
});
