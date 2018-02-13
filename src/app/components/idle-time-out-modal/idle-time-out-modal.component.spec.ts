import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleTimeOutModalComponent } from './idle-time-out-modal.component';

describe('IdleTimeOutModalComponent', () => {
  let component: IdleTimeOutModalComponent;
  let fixture: ComponentFixture<IdleTimeOutModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdleTimeOutModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleTimeOutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
