import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendVerifyValidateComponent } from './send-verify-validate.component';

describe('SendVerifyValidateComponent', () => {
  let component: SendVerifyValidateComponent;
  let fixture: ComponentFixture<SendVerifyValidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendVerifyValidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendVerifyValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
