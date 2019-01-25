import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NgvFormBuilder } from 'projects/ngv-form-decorators/src/public_api';
import { AppForm } from './app.form';

@Component({
  selector: 'ngv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngv-form-decorators-demo';
  @NgvFormBuilder(AppForm)
  form: FormGroup;
}
