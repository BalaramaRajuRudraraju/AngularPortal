import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessTypesComponent } from './business-types.component';

describe('BusinessTypesComponent', () => {
  let component: BusinessTypesComponent;
  let fixture: ComponentFixture<BusinessTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
