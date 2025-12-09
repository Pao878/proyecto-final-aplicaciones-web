import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 carousel images', () => {
    expect(component.carouselImages.length).toBe(3);
  });

  it('should have 3 directivos', () => {
    expect(component.directivos.length).toBe(3);
  });

  it('should have proper directivo structure', () => {
    const directivo = component.directivos[0];
    expect(directivo.imagen).toBeDefined();
    expect(directivo.cargo).toBeDefined();
    expect(directivo.nombre).toBeDefined();
    expect(directivo.descripcion).toBeDefined();
  });
});
