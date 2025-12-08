import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsultasComponent } from './admin-consultas.component';

describe('AdminConsultasComponent', () => {
  let component: AdminConsultasComponent;
  let fixture: ComponentFixture<AdminConsultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminConsultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConsultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
