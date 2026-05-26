import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { addRevisionYear, isTodayOrFuture, toDateOnly } from '../domain/dates';

export interface ProductFormValue {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export const emptyProductForm: ProductFormValue = {
  id: '',
  name: '',
  description: '',
  logo: '',
  date_release: '',
  date_revision: '',
};

export function requiredField(message = 'Este campo es requerido!'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = typeof control.value === 'string' ? control.value.trim() : control.value;
    return value ? null : { message };
  };
}

export function productIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return { message: 'Este campo es requerido!' };
    if (value.length < 3 || value.length > 10) return { message: 'ID no valido!' };
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) return { message: 'ID no valido!' };
    return null;
  };
}

export function productNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return { message: 'Este campo es requerido!' };
    if (value.length < 6 || value.length > 100) return { message: 'Nombre no valido!' };
    return null;
  };
}

export function productDescriptionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return { message: 'Este campo es requerido!' };
    if (value.length < 10 || value.length > 200) return { message: 'Descripcion no valida!' };
    return null;
  };
}

export function releaseDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return { message: 'Este campo es requerido!' };
    if (!isTodayOrFuture(value)) {
      return { message: 'La fecha debe ser igual o mayor a hoy!' };
    }
    return null;
  };
}

export function revisionDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '').trim();
    if (!value) return { message: 'Este campo es requerido!' };
    return null;
  };
}

export function productFormValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const release = String(control.get('date_release')?.value ?? '').trim();
    const revision = String(control.get('date_revision')?.value ?? '').trim();
    if (!release || !revision) return null;

    const expected = addRevisionYear(release);
    if (toDateOnly(revision) !== expected) {
      return {
        date_revision: 'Debe ser exactamente un anio despues de la fecha de liberacion!',
      };
    }
    return null;
  };
}

export function getControlError(control: AbstractControl | null): string | null {
  if (!control || !control.errors || !(control.dirty || control.touched)) return null;
  const errors = control.errors;
  if (errors['message']) return String(errors['message']);
  if (errors['date_revision']) return String(errors['date_revision']);
  return 'Campo no valido!';
}
