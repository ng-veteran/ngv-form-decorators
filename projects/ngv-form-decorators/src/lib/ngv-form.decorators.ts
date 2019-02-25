import { NgvFormConfig } from './ngv-form-config';
import { NgvFormControlType } from './ngv-form-control-type.enum';
import { isUndefined, isObject, isFunction, isString } from 'util';
import { AbstractControl, FormControl, FormArray, FormGroup } from '@angular/forms';
import { NgvFormClassConfig } from './ngv-form-class-config';
import { NgvFormPropertyConfig } from './ngv-form-property-config';

/**
 * 表单注解配置方法
 * @ignore
 */
export class NgvFormDecorators {

  static configs = new Map<Function, NgvFormClassConfig>();

  /**
   *
   * @param type 控件类型
   * @param target 配置目标
   * @param propertyKey 配置目标属性名称
   * @param customConfig 自定义配置信息 {@Link NgvFormConfig}
   */
  static addConfig(
    type: NgvFormControlType,
    target: Object | Function,
    propertyKey?: string,
    customConfig?: Partial<NgvFormConfig>
  ) {
    let targeClassConstructor: FunctionConstructor;
    if (isObject(target)) {
      targeClassConstructor = target.constructor as FunctionConstructor;
    } else if (isFunction(target)) {
      targeClassConstructor = target as FunctionConstructor;
    } else {
      throw new Error('只能为类型原型或类型构造方法添加配置');
    }

    // 初始化配置
    let config: NgvFormPropertyConfig | NgvFormClassConfig;

    if (isString(propertyKey)) {
      config = new NgvFormPropertyConfig();
    } else {
      config = new NgvFormClassConfig();
    }

    // 设置控件自定配置
    if (isObject(customConfig)) {
      config = Object.assign(config, customConfig);
    }

    let root = this.configs.get(targeClassConstructor);

    // 自动配置控件属性class根配置
    if (isUndefined(root)) {
      root = new NgvFormClassConfig();
      // 自动配置表单控件值构造方法
      root.classConstructor = targeClassConstructor;
      root.properties = new Map<string, NgvFormPropertyConfig>();
      this.configs.set(targeClassConstructor, root);
    }

    if (config instanceof NgvFormClassConfig) {
      // 自动配置覆盖自定义参数
      config = Object.assign(config, root);
      // 更新class配置
      this.configs.set(targeClassConstructor, config);
    } else {
      // 自动配置控件类型
      config.type = type;
      // 自动配置控件名称
      config.propertyKey = propertyKey;
      // 设置属性配置到class
      root.properties.set(propertyKey, config);
    }
  }

  /**
   * 创建表单控件
   * @param config 表单控件配置 {@link NgvFormClassConfig|NgvFormPropertyConfig}
   */
  static createControl(config: NgvFormClassConfig | NgvFormPropertyConfig): AbstractControl {

    if (config.ignore) {
      return null;
    }

    switch (config.type) {
      case NgvFormControlType.CONTROL: {
        const control = new FormControl(null, config.validators);
        return control;
      }
      case NgvFormControlType.GROUP: {

        let control: FormGroup;
        if (config instanceof NgvFormClassConfig) {
          const defaultValue = new (config.classConstructor as FunctionConstructor)();
          control = new FormGroup({}, config.validators);
          config.properties.forEach(item => {
            control.setControl(item.propertyKey, this.createControl(item));
          });
          control.patchValue(defaultValue);
        } else if (config instanceof NgvFormPropertyConfig) {
          const classConfig = this.configs.get(config.classConstructor);
          if (!(classConfig instanceof NgvFormClassConfig)) {
            throw new Error(`不能创建属性${config.propertyKey}子控件组,${config.classConstructor.name}没有配置表单控件组`);
          }
          control = this.createControl(classConfig) as FormGroup;
        }
        return control;
      }
      case NgvFormControlType.ARRAY: {
        const control = new FormArray([], config.validators);
        return control;
      }
    }
  }

  static build<T extends Function>(classConstructor: T) {
    const config = this.configs.get(classConstructor);
    if (isUndefined(config)) {
      throw new Error(`"class ${classConstructor.name}"找不到表单配置`);
    }
    const control = this.createControl(config);
    return control;
  }

}



/**
 * 表单列表
 * @param config 配置
 */
export function NgvFormArray(config?: Partial<NgvFormConfig>) {
  return function (target: Object, propertyKey: string) {
    NgvFormDecorators.addConfig(NgvFormControlType.ARRAY, target, propertyKey, config);
  };
}


/**
 * 配置一组表单控件
 * @param config 控件配置
 */
export function NgvFormGroup(config?: Partial<NgvFormConfig>) {
  return function (target: Object | Function, propertyKey?: string) {
    console.log(target, propertyKey);
    NgvFormDecorators.addConfig(NgvFormControlType.GROUP, target, propertyKey, config);
  };
}

/**
 * 控件注解
 * @param partialConfig 控件配置信息
 */
export function NgvFormControl(partialConfig?: Partial<NgvFormConfig>) {
  return function (target: Object, propertyKey: string) {
    NgvFormDecorators.addConfig(NgvFormControlType.CONTROL, target, propertyKey, partialConfig);
  };
}

/**
 * 表单构建器注解
 * @param token 构建表单配置类型
 */
export function NgvFormBuilder(classConstructor: Function) {
  return function (target: Object, propertyKey: string) {
    const form = NgvFormDecorators.build(classConstructor);
    target[propertyKey] = form;
  };
}
