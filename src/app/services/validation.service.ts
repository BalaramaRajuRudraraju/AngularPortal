import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, FormControl } from '@angular/forms';

import ValidationHelper from '../validations-helper';

const {
  expressions,
  messages
} = ValidationHelper;

@Injectable()
export class ValidationService {

  constructor() { }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    // Include all possible validation errors in this config
    const validationMessageConfig = {
      'required': 'Required',
      'pattern': 'Please capture a valid value',
      'minlength': `Minimum length ${validatorValue.requiredLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}`
    };
    return validationMessageConfig[validatorName];
  }

  static validateAllFieldsOnNext(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFieldsOnNext(control);
      }
    });
  }

  static removeFields = (formGroup: FormGroup, exceptions: string[]) => {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (exceptions.some((fieldName) => fieldName === field) && (control instanceof FormControl || control instanceof FormGroup)) {
        if (control instanceof FormControl) {
          (<FormControl>control).setValue(null);
        }
        formGroup.removeControl(field);
      }
    });
  }


  static getErrorMessage = (control: AbstractControl): string => {
    let errorMessage = '';
    for (const propertyName in control.errors) {
      if (control.errors.hasOwnProperty(propertyName)) {
        errorMessage += ValidationService.getValidatorErrorMessage(propertyName, control.errors[propertyName]) + '\n';
      }
    }
    return errorMessage;
  }

}
