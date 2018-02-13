import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySocialMediaInfoComponent } from './company-social-media-info.component';

describe('CompanySocialMediaInfoComponent', () => {
  let component: CompanySocialMediaInfoComponent;
  let fixture: ComponentFixture<CompanySocialMediaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanySocialMediaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySocialMediaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
