import { NgvFormGroupDecorator, NgvFormControlDecorator } from 'projects/ngv-form-decorators/src/public_api';
import { Validators } from '@angular/forms';

@NgvFormGroupDecorator()
export class AppForm {
  @NgvFormControlDecorator({
    validators: Validators.required
  })
  input1: string;
}
