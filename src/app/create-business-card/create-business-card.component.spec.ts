import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBusinessCardComponent } from './create-business-card.component';

describe('CreateBusinessCardComponent', () => {
  let component: CreateBusinessCardComponent;
  let fixture: ComponentFixture<CreateBusinessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBusinessCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateBusinessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
