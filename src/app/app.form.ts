import { NgvFormGroup, NgvFormControl } from 'projects/ngv-form-decorators/src/public_api';
import { Validators } from '@angular/forms';

@NgvFormGroup()
export class AppForm {
  @NgvFormControl({
    validators: Validators.required
  })
  input1: string;
}
