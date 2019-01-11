import { TestBed } from '@angular/core/testing';

import { NgvFormDecoratorsService } from './ngv-form-decorators.service';

describe('NgvFormDecoratorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgvFormDecoratorsService = TestBed.get(NgvFormDecoratorsService);
    expect(service).toBeTruthy();
  });
});
