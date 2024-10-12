import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCardFormComponent } from './business-card-form.component';

describe('BusinessCardFormComponent', () => {
  let component: BusinessCardFormComponent;
  let fixture: ComponentFixture<BusinessCardFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessCardFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BusinessCardFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
