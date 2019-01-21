import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, FormArray } from '@angular/forms';
import { NgvFormDecorators } from './ngv-form.decorators';

@Injectable({
  providedIn: 'root'
})
export class NgvFormService {

  constructor() { }

  set<T extends Object>(classConstructor: T['constructor'], key: (keyof T & string), target: FormGroup) {
    const config = NgvFormDecorators.configs.get(classConstructor);
    const control = NgvFormDecorators.createControl(config.properties.get(key));
    target.setControl(key, control);
    return control;
  }


  get<T>(source: AbstractControl, key: keyof T & string) {
    return source.get(key);
  }
}
