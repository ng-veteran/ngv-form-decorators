import { NgvFormConfig } from './ngv-form-config';
import { NgvFormPropertyConfig } from './ngv-form-property-config';
import { NgvFormControlType } from './ngv-form-control-type.enum';

export class NgvFormClassConfig extends NgvFormConfig {


  /**
   * 控件类型
   */
  readonly type: NgvFormControlType = NgvFormControlType.GROUP;

  /**
   * 子控件配置列表,不需要配置
   */
  properties: Map<string, NgvFormPropertyConfig>;

}
