import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import{ InicioComponent} from './inicio/inicio'
import { AuthService } from '../../services/auth.service';

describe('InicioComponent', () => {
  let component: InicioComponent;
  let fixture: ComponentFixture<InicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InicioComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      providers: [AuthService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty model initially', () => {
    expect(component.model.email).toBe('');
    expect(component.model.password).toBe('');
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    const mockForm: any = { invalid: true };
    spyOn(component, 'onSubmit').and.callThrough();
    component.onSubmit(mockForm);
    expect(component.isLoading).toBe(false);
  });

  it('should clear error message', () => {
    component.errorMessage = 'Test error';
    component.clearError();
    expect(component.errorMessage).toBe('');
  });
});
