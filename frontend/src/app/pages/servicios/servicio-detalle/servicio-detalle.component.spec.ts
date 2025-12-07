import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioDetalleComponent } from './servicio-detalle.component';

describe('ServicioDetalleComponent', () => {
  let component: ServicioDetalleComponent;
  let fixture: ComponentFixture<ServicioDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicioDetalleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
