import { TestBed } from '@angular/core/testing';

import { NgvFormService } from './ngv-form.service';
import { NgvFormDecorators, NgvFormControlDecorator, NgvFormGroupDecorator } from './ngv-form.decorators';
import { FormGroup, FormControl } from '@angular/forms';
import { NgvFormClassConfig } from './ngv-form-class-config';

describe('NgvFormService', () => {
  let service: NgvFormService;
  let configs: Map<Function, NgvFormClassConfig>;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    configs = new Map<Function, NgvFormClassConfig>();
    Object.defineProperty(NgvFormDecorators, 'configs', { get: () => configs });
    service = TestBed.get(NgvFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#build', () => {
    let spyCreateControl: jasmine.Spy;

    beforeEach(() => {
      spyCreateControl = spyOn(NgvFormDecorators, 'createControl');
    });

    it('应该根据指定类型表单配置，设置属性控件', () => {

      class User {
        @NgvFormControlDecorator()
        name: string;
      }

      const form = new FormGroup({});
      const control = new FormControl();
      const propertyName = 'name';

      spyCreateControl.and.returnValue(control);
      service.set<User>(User, propertyName, form);
      const config = configs.get(User).properties.get(propertyName);
      expect(spyCreateControl).toHaveBeenCalledWith(config);
      expect(form.get(propertyName)).toEqual(control);

    });

  });

});
