import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessFailureModalComponent } from './success-failure-modal.component';

describe('SaveCancelModalComponent', () => {
  let component: SuccessFailureModalComponent;
  let fixture: ComponentFixture<SuccessFailureModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessFailureModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessFailureModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
