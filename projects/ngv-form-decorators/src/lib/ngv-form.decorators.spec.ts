import { TestBed } from '@angular/core/testing';

import {
  NgvFormDecorators,
  NgvFormGroupDecorator,
  NgvFormBuilder,
  NgvFormControlDecorator,
  NgvFormArrayDecorator
} from './ngv-form.decorators';
import { FormGroup, FormControl, AbstractControl, ValidationErrors, FormArray, Validators } from '@angular/forms';
import { NgvFormControlType } from './ngv-form-control-type.enum';
import { NgvFormConfig } from './ngv-form-config';
import { NgvFormClassConfig } from './ngv-form-class-config';
import { NgvFormPropertyConfig } from './ngv-form-property-config';
import { OnInit } from '@angular/core';

describe('NgvFormDecorators', () => {

  let configs: Map<Function, NgvFormClassConfig>;

  beforeEach(() => {
    configs = new Map<Function, NgvFormClassConfig>();
    Object.defineProperty(NgvFormDecorators, 'configs', {
      get: () => configs
    });
  });

  describe('#addConfig', () => {
    const defaultConfig: Partial<NgvFormConfig> = {
      ignore: false
    };

    it('应该“只能为类型原型或类型构造方法添加配置”异常', () => {
      expect(() => {
        NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, null, undefined, undefined);
      }).toThrowError('只能为类型原型或类型构造方法添加配置');
    });

    it('应该可以添加属性配置到类型配置的属性配置列表', () => {
      const customConfig: Partial<NgvFormConfig> = {
        validators: (control: AbstractControl): ValidationErrors => {
          return null;
        }
      };
      class User {
        name: string;
      }
      const classConfig = new NgvFormClassConfig();
      classConfig.classConstructor = User;
      classConfig.properties = new Map();
      configs.set(User, classConfig);

      const propertyName = 'name';
      NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, User, propertyName, customConfig);

      const propertyConfig = configs.get(User).properties.get(propertyName);
      expect(propertyConfig).toEqual(jasmine.any(NgvFormPropertyConfig));
      expect(propertyConfig.propertyKey).toBe(propertyName);

    });

    it('应该添加类型属性控件表单配置,且默认不校验器', () => {
      class User {
        name: string;
      }
      const propertyKey = 'name';
      NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, User, propertyKey, undefined);
      const config = configs.get(User).properties.get(propertyKey);
      expect(config.type).toBe(NgvFormControlType.CONTROL);
      expect(config.propertyKey).toBe(propertyKey);
      expect(config).toEqual(jasmine.objectContaining(defaultConfig));
    });

    it('应该添加类型属性控件表单配置,且配置自定义控件校验器', () => {
      const customConfig: Partial<NgvFormConfig> = {
        classConstructor: String,
        validators: (control: AbstractControl): ValidationErrors => {
          return null;
        }
      };
      class User {
        name: string;
      }
      const propertyKey = 'name';
      NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, User, propertyKey, customConfig);
      const config = configs.get(User).properties.get(propertyKey);
      expect(config.type).toBe(NgvFormControlType.CONTROL);
      expect(config.propertyKey).toBe(propertyKey);
      expect(config).toEqual(jasmine.objectContaining(customConfig));
    });

    it('应该添加类型控件组表单配置,且默认不校验器', () => {
      class User {
      }
      NgvFormDecorators.addConfig(NgvFormControlType.GROUP, User.prototype, undefined, undefined);
      const config = configs.get(User);
      expect(config.type).toBe(NgvFormControlType.GROUP);
      expect(config.classConstructor).toBe(User);
      expect(config.properties).toEqual(jasmine.any(Map));
      expect(config.properties.size).toEqual(0);
      expect(config as NgvFormConfig).toEqual(jasmine.objectContaining(defaultConfig));
    });

    it('应该添加类型控件组表单配置，且配置自定义控件校验器', () => {
      const customConfig: Partial<NgvFormConfig> = {
        validators: (control: AbstractControl): ValidationErrors => {
          return null;
        }
      };

      class User {
      }

      NgvFormDecorators.addConfig(NgvFormControlType.GROUP, User.prototype, undefined, customConfig);
      const config = configs.get(User);
      expect(config.type).toBe(NgvFormControlType.GROUP);
      expect(config.classConstructor).toBe(User);
      expect(config.properties).toEqual(jasmine.any(Map));
      expect(config.properties.size).toBe(0);
      expect(config as NgvFormConfig).toEqual(jasmine.objectContaining(customConfig));
    });

    it('应该添加属性配置到类型配置', () => {
      class User {
        name: string;
      }
      const propertyKey = 'name';
      NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, User, propertyKey, undefined);
      const root = configs.get(User);
      expect(root).toEqual(jasmine.any(NgvFormClassConfig));
      expect(root.classConstructor).toBe(User);
      expect(root.type).toBe(NgvFormControlType.GROUP);

      const config = root.properties.get(propertyKey);
      expect(config.type).toBe(NgvFormControlType.CONTROL);
      expect(config.classConstructor).toBeUndefined();
      expect(config.propertyKey).toBe(propertyKey);
    });
  });

  describe('#build', () => {
    let spyCreateControl: jasmine.Spy;

    beforeEach(() => {
      spyCreateControl = spyOn(NgvFormDecorators, 'createControl');
    });

    afterEach(() => {
      spyCreateControl.and.callThrough();
    });

    it('应该使用类型表单配置创建控件', () => {
      class User {
        name = 'name';
      }

      const config = new NgvFormClassConfig();
      config.classConstructor = User;
      configs.set(User, config);

      const form = new FormGroup({});

      spyCreateControl.and.returnValue(form);

      expect(NgvFormDecorators.build(User)).toBe(form);
      expect(spyCreateControl).toHaveBeenCalledWith(config);
    });

    it('应该类型找不到表单配置异常', () => {
      class User {
        name = 'name';
      }

      expect(() => {
        NgvFormDecorators.build(User);
      }).toThrowError(`"class ${User.name}"找不到表单配置`);
    });

  });

  describe('#createControl', () => {

    it('应该创建一个空控件组', () => {
      class User {
        name = 'name';
      }


      const config = new NgvFormClassConfig();
      config.classConstructor = User;
      config.properties = new Map();

      const form = NgvFormDecorators.createControl(config) as FormGroup;

      expect(form).toEqual(jasmine.any(FormGroup));

      expect(Object.keys(form.controls)).toEqual([]);
    });

    it('应该创建一个控件组且带有子控件', () => {
      class User {
        name = 'name';
        age: number;
      }

      const nameConfig = new NgvFormPropertyConfig();
      nameConfig.propertyKey = 'name';
      nameConfig.type = NgvFormControlType.CONTROL;
      nameConfig.validators = [
        (control: AbstractControl): ValidationErrors => null
      ];
      const ageConfig = new NgvFormPropertyConfig();
      ageConfig.propertyKey = 'age';
      ageConfig.type = NgvFormControlType.CONTROL;


      const config = new NgvFormClassConfig();
      config.classConstructor = User;
      config.properties = new Map<string, NgvFormPropertyConfig>();
      config.validators = (control: AbstractControl): ValidationErrors => null;
      config.properties.set(nameConfig.propertyKey, nameConfig);
      config.properties.set(ageConfig.propertyKey, ageConfig);

      const defaultValue = new User();
      const form = NgvFormDecorators.createControl(config) as FormGroup;

      expect(form).toEqual(jasmine.any(FormGroup));
      expect(form.get(nameConfig.propertyKey)).toEqual(jasmine.any(FormControl));
      expect(form.get(ageConfig.propertyKey)).toEqual(jasmine.any(FormControl));
      expect(Object.keys(form.controls)).toEqual(Array.from(config.properties.keys()));
      expect(form.value).toEqual(jasmine.objectContaining(defaultValue));
    });

    it('应该创建一个控件组，且带有子控件组', () => {

      class Address {
        detail: string;
      }

      class User {
        address: Address;
      }

      const detailPropertyConfig = new NgvFormPropertyConfig();
      detailPropertyConfig.type = NgvFormControlType.CONTROL;
      detailPropertyConfig.propertyKey = 'detail';

      const addressClassConfig = new NgvFormClassConfig();
      addressClassConfig.classConstructor = Address;
      addressClassConfig.properties = new Map();
      addressClassConfig.properties.set(detailPropertyConfig.propertyKey, detailPropertyConfig);
      configs.set(Address, addressClassConfig);


      const addressPropertyConfig = new NgvFormPropertyConfig();
      addressPropertyConfig.type = NgvFormControlType.GROUP;
      addressPropertyConfig.classConstructor = Address;
      addressPropertyConfig.propertyKey = 'address';

      const userClassConfig = new NgvFormClassConfig();
      userClassConfig.classConstructor = User;
      userClassConfig.properties = new Map();
      userClassConfig.properties.set(addressPropertyConfig.propertyKey, addressPropertyConfig);

      const form = NgvFormDecorators.createControl(userClassConfig) as FormGroup;

      expect(form).toEqual(jasmine.any(FormGroup));
      expect(form.get(addressPropertyConfig.propertyKey)).toEqual(jasmine.any(FormGroup));
      expect(form.get([addressPropertyConfig.propertyKey, detailPropertyConfig.propertyKey])).toEqual(jasmine.any(FormControl));
    });

    it('应该异常“不能创建属性address子控件组,Address没有配置表单控件组”', () => {

      class Address {
        detail: string;
      }

      class User {
        address: Address;
      }

      const detailPropertyConfig = new NgvFormPropertyConfig();
      detailPropertyConfig.type = NgvFormControlType.CONTROL;
      detailPropertyConfig.propertyKey = 'detail';

      const addressClassConfig = new NgvFormClassConfig();
      addressClassConfig.classConstructor = Address;
      addressClassConfig.properties = new Map();
      addressClassConfig.properties.set(detailPropertyConfig.propertyKey, detailPropertyConfig);

      const addressPropertyConfig = new NgvFormPropertyConfig();
      addressPropertyConfig.type = NgvFormControlType.GROUP;
      addressPropertyConfig.classConstructor = Address;
      addressPropertyConfig.propertyKey = 'address';

      const userClassConfig = new NgvFormClassConfig();
      userClassConfig.classConstructor = User;
      userClassConfig.properties = new Map();
      userClassConfig.properties.set(addressPropertyConfig.propertyKey, addressPropertyConfig);

      expect(() => {
        NgvFormDecorators.createControl(userClassConfig);
      }).toThrowError('不能创建属性address子控件组,Address没有配置表单控件组');

    });

    it('应该忽略创建属性控件', () => {
      class User {
        name = 'name';
        age: number;
      }

      const nameConfig = new NgvFormPropertyConfig();
      nameConfig.propertyKey = 'name';
      nameConfig.type = NgvFormControlType.CONTROL;
      nameConfig.validators = [
        (control: AbstractControl): ValidationErrors => null
      ];
      const ageConfig = new NgvFormPropertyConfig();
      ageConfig.propertyKey = 'age';
      ageConfig.type = NgvFormControlType.CONTROL;
      ageConfig.ignore = true;

      const config = new NgvFormClassConfig();
      config.classConstructor = User;
      config.properties = new Map<string, NgvFormPropertyConfig>();
      config.validators = (control: AbstractControl): ValidationErrors => null;
      config.properties.set(nameConfig.propertyKey, nameConfig);
      config.properties.set(ageConfig.propertyKey, ageConfig);

      const defaultValue = new User();
      const form = NgvFormDecorators.createControl(config) as FormGroup;

      expect(form).toEqual(jasmine.any(FormGroup));
      expect(form.get(nameConfig.propertyKey)).toEqual(jasmine.any(FormControl));
      expect(form.get(ageConfig.propertyKey)).toBeNull();
      expect(Object.keys(form.controls)).toEqual(Array.from(config.properties.keys()).filter(key => ageConfig.propertyKey !== key));
      expect(form.value).toEqual(jasmine.objectContaining(defaultValue));
    });

    it('应该创建控件列表', () => {
      class Address {
        detail: string;
      }

      class User {
        address: Array<Address>;
      }

      const detailPropertyConfig = new NgvFormPropertyConfig();
      detailPropertyConfig.type = NgvFormControlType.CONTROL;
      detailPropertyConfig.propertyKey = 'detail';

      const addressClassConfig = new NgvFormClassConfig();
      addressClassConfig.classConstructor = Address;
      addressClassConfig.properties = new Map();
      addressClassConfig.properties.set(detailPropertyConfig.propertyKey, detailPropertyConfig);
      configs.set(Address, addressClassConfig);


      const addressPropertyConfig = new NgvFormPropertyConfig();
      addressPropertyConfig.type = NgvFormControlType.ARRAY;
      addressPropertyConfig.classConstructor = Address;
      addressPropertyConfig.propertyKey = 'address';

      const userClassConfig = new NgvFormClassConfig();
      userClassConfig.classConstructor = User;
      userClassConfig.properties = new Map();
      userClassConfig.properties.set(addressPropertyConfig.propertyKey, addressPropertyConfig);

      const form = NgvFormDecorators.createControl(userClassConfig);

    });
  });

  describe('注解配置', () => {
    const validator = (control: AbstractControl): ValidationErrors => {
      return null;
    };

    describe('控件组', () => {

      let spyAddConfig: jasmine.Spy;

      beforeEach(() => {
        spyAddConfig = spyOn(NgvFormDecorators, 'addConfig');
      });

      afterEach(() => {
        spyAddConfig.and.callThrough();
      });

      it('应该类型添加表单控件组配置', () => {
        const config = {
          validators: validator
        };
        @NgvFormGroupDecorator(config)
        class User {
        }

        expect(spyAddConfig).toHaveBeenCalledWith(NgvFormControlType.GROUP, User, undefined, config);
      });

      it('应该类型添加表单控件组子控件组配置', () => {

        @NgvFormGroupDecorator()
        class Address {
          constructor() { }
        }

        expect(spyAddConfig).toHaveBeenCalledWith(NgvFormControlType.GROUP, Address, undefined, undefined);

        spyAddConfig.calls.reset();

        const config: Partial<NgvFormConfig> = {
          classConstructor: Address
        };

        @NgvFormGroupDecorator()
        abstract class User {
          @NgvFormGroupDecorator(config)
          address: Address;
        }

        expect(spyAddConfig.calls.allArgs()).toEqual([
          // 先添加属性配置
          [NgvFormControlType.GROUP, User.prototype, 'address', config],
          // 再添加类型配置
          [NgvFormControlType.GROUP, User, undefined, undefined]
        ]);
      });

      it('应该类型添加表单控件组子控件配置', () => {
        const config = {
          validators: validator
        };

        @NgvFormGroupDecorator()
        abstract class User {
          @NgvFormControlDecorator(config)
          name: string;
        }


        expect(spyAddConfig.calls.allArgs()).toEqual([
          [NgvFormControlType.CONTROL, User.prototype, 'name', config],
          [NgvFormControlType.GROUP, User, undefined, undefined]
        ]);
      });

      it('应该类型添加表单控件组子控件列表', () => {
        const config: Partial<NgvFormConfig> = {
          validators: validator
        };

        @NgvFormGroupDecorator()
        abstract class User {
          @NgvFormArrayDecorator(config)
          permissions: number[];
        }

        expect(spyAddConfig.calls.allArgs()).toEqual([
          [NgvFormControlType.ARRAY, User.prototype, 'permissions', config],
          [NgvFormControlType.GROUP, User, undefined, undefined]
        ]);

      });


      it('应该类型添加表单控件组子控件组列表', () => {
        const config: Partial<NgvFormConfig> = {
          validators: validator
        };

        @NgvFormGroupDecorator()
        abstract class User {
          @NgvFormArrayDecorator(config)
          permissions: number[];
        }

        expect(spyAddConfig.calls.allArgs()).toEqual([
          [NgvFormControlType.ARRAY, User.prototype, 'permissions', config],
          [NgvFormControlType.GROUP, User, undefined, undefined]
        ]);
      });

      it('应该类型添加表单控件', () => {

      });
    });

    describe('构建表单控件', () => {

      let spyBuilder: jasmine.Spy;

      beforeEach(() => {
        spyBuilder = spyOn(NgvFormDecorators, 'build');
      });

      afterEach(() => {
        spyBuilder.and.callThrough();
      });

      it('应该构建表单设置为属性默认值', () => {
        class User {
        }

        const form = new FormGroup({});
        spyBuilder.and.returnValue(form);

        class Test implements OnInit {

          @NgvFormBuilder(User)
          form: FormGroup;
          initNum = 0;
          ngOnInit(): void {
            this.initNum = 1;
          }
        }

        const test = new Test();
        test.ngOnInit();
        expect(spyBuilder).toHaveBeenCalledWith(User);
        expect(test.form).toBe(form);
        expect(test.initNum).toBe(1);

        const test1 = new Test();
        test1.ngOnInit();
        expect(spyBuilder.calls.count()).toBe(2);
        expect(test1.form).toBe(form);
        expect(test.initNum).toBe(1);

      });

    });
  });

});
