import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPackageComponent } from './my-package.component';

describe('MyPackageComponent', () => {
  let component: MyPackageComponent;
  let fixture: ComponentFixture<MyPackageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyPackageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
