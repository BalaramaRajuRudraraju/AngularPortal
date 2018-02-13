import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAddressDetailsComponent } from './company-address-details.component';

describe('CompanyAddressDetailsComponent', () => {
  let component: CompanyAddressDetailsComponent;
  let fixture: ComponentFixture<CompanyAddressDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyAddressDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyAddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
