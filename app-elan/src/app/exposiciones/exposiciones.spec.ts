import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExposicionesComponent } from './exposiciones';

describe('Exposiciones', () => {
  let component: ExposicionesComponent;
  let fixture: ComponentFixture<ExposicionesComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExposicionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExposicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
