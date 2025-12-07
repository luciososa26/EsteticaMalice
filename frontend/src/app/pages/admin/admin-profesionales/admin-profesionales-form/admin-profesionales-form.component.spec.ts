import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfesionalesFormComponent } from './admin-profesionales-form.component';

describe('AdminProfesionalesFormComponent', () => {
  let component: AdminProfesionalesFormComponent;
  let fixture: ComponentFixture<AdminProfesionalesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfesionalesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfesionalesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
