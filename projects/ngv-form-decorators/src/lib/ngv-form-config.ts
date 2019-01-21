import { ValidatorFn } from '@angular/forms';
import { NgvFormControlType } from './ngv-form-control-type.enum';

/**
 * 表单默认配置
 */
export class NgvFormConfig {
  readonly type: NgvFormControlType;
  /**
   * 控件值类型构造方法
   */
  classConstructor: Function;

  /**
   * 校验器
   */
  validators: ValidatorFn | ValidatorFn[];

  /**
   * 忽略字段
   */
  ignore = false;
}
