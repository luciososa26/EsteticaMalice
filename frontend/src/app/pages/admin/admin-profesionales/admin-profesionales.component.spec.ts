import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfesionalesComponent } from './admin-profesionales.component';

describe('AdminProfesionalesComponent', () => {
  let component: AdminProfesionalesComponent;
  let fixture: ComponentFixture<AdminProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfesionalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
