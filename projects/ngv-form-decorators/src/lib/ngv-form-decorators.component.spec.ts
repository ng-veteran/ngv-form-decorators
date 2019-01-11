import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgvFormDecoratorsComponent } from './ngv-form-decorators.component';

describe('NgvFormDecoratorsComponent', () => {
  let component: NgvFormDecoratorsComponent;
  let fixture: ComponentFixture<NgvFormDecoratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgvFormDecoratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgvFormDecoratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
