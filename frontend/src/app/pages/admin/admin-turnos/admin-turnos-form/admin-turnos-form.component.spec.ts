import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTurnosFormComponent } from './admin-turnos-form.component';

describe('AdminTurnosFormComponent', () => {
  let component: AdminTurnosFormComponent;
  let fixture: ComponentFixture<AdminTurnosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminTurnosFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTurnosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
