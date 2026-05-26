import { FormControl, FormGroup } from '@angular/forms';
import { addRevisionYear } from '../domain/dates';
import {
  getControlError,
  productDescriptionValidator,
  productFormValidator,
  productIdValidator,
  productNameValidator,
  releaseDateValidator,
} from './product.validators';

const validBase = {
  id: 'trj-crd-1',
  name: 'Tarjeta Credito 1',
  description: 'Descripcion valida de producto 1',
  logo: 'https://test-devsu.com/logo.png',
  date_release: '2026-06-15',
  date_revision: addRevisionYear('2026-06-15'),
};

describe('validadores formulario producto', () => {
  it('acepta datos validos con revision un anio despues', () => {
    const group = new FormGroup(
      {
        id: new FormControl(validBase.id),
        name: new FormControl(validBase.name),
        description: new FormControl(validBase.description),
        logo: new FormControl(validBase.logo),
        date_release: new FormControl(validBase.date_release),
        date_revision: new FormControl(validBase.date_revision),
      },
      { validators: [productFormValidator()] }
    );

    expect(group.valid).toBe(true);
  });

  it('rechaza id invalido', () => {
    const control = new FormControl('ab');
    expect(productIdValidator()(control)).toEqual({ message: 'ID no valido!' });
  });

  it('rechaza nombre con menos de 6 caracteres', () => {
    const control = new FormControl('abcde');
    expect(productNameValidator()(control)).toEqual({ message: 'Nombre no valido!' });
  });

  it('rechaza descripcion corta', () => {
    const control = new FormControl('corta');
    expect(productDescriptionValidator()(control)).toEqual({
      message: 'Descripcion no valida!',
    });
  });

  it('rechaza fecha de liberacion en el pasado', () => {
    const control = new FormControl('2000-01-01');
    expect(releaseDateValidator()(control)).toEqual({
      message: 'La fecha debe ser igual o mayor a hoy!',
    });
  });

  it('rechaza revision que no sea un anio despues de liberacion', () => {
    const group = new FormGroup(
      {
        id: new FormControl(validBase.id),
        name: new FormControl(validBase.name),
        description: new FormControl(validBase.description),
        logo: new FormControl(validBase.logo),
        date_release: new FormControl(validBase.date_release),
        date_revision: new FormControl(validBase.date_release),
      },
      { validators: [productFormValidator()] }
    );

    expect(group.errors?.['date_revision']).toContain('Debe ser exactamente');
  });

  it('getControlError devuelve mensaje cuando el control fue tocado', () => {
    const control = new FormControl('');
    control.markAsTouched();
    control.setErrors({ message: 'Este campo es requerido!' });
    expect(getControlError(control)).toBe('Este campo es requerido!');
  });
});
