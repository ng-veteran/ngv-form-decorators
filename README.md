[![CircleCI](https://circleci.com/gh/ng-veteran/ngv-form-decorators.svg?style=svg)](https://circleci.com/gh/ng-veteran/ngv-form-decorators)
[![codecov](https://codecov.io/gh/ng-veteran/ngv-form-decorators/branch/master/graph/badge.svg)](https://codecov.io/gh/ng-veteran/ngv-form-decorators)
[![npm version](https://badge.fury.io/js/%40ng-veteran%2Fngv-form-decorators.svg)](https://badge.fury.io/js/%40ng-veteran%2Fngv-form-decorators)

# NgvFormDecorators

一种使用注解配置 angular表单的工具 （A tool for configuring angular forms using decorators ）

## 为什么使用它？(Why use it ?)

* 表单配置与数据模型统一配置
  > 创建文件 app.form.ts
  ``` typescript
    import { NgvFormGroupDecorator, NgvFormControlDecorator } from '@ng-veteran/ngv-form-decorators';
    import { Validators } from '@angular/forms';

    @NgvFormGroup()
    export class AppForm {
      @NgvFormControl({
        validators: Validators.required
      })
      input1: string;
    }
  ```
* 自动注入表单实例
  > 在组件模块使用表单
  ``` typescript
  import { Component } from '@angular/core';
  import { FormGroup } from '@angular/forms';
  import { NgvFormBuilder } from '@ng-veteran/ngv-form-decorators';
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
  ```
