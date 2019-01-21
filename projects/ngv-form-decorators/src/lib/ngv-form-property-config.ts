import { NgvFormConfig } from './ngv-form-config';
import { NgvFormControlType } from './ngv-form-control-type.enum';

export class NgvFormPropertyConfig extends NgvFormConfig {
  /**
  * 控件类型
  */
  type: NgvFormControlType;

  /**
   * 注解字段，不需要配置，自动读取属性名称
   */
  propertyKey: string;
}
