import { Component, effect, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { FinancialProduct } from '../../../domain/product';
import { addRevisionYear } from '../../../domain/dates';
import {
  emptyProductForm,
  getControlError,
  productDescriptionValidator,
  productFormValidator,
  productIdValidator,
  productNameValidator,
  releaseDateValidator,
  requiredField,
  revisionDateValidator,
} from '../../../application/product.validators';
import { PRODUCT_USE_CASES } from '../../di/product.tokens';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { InputFieldComponent } from '../../shared/ui/input-field/input-field.component';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, AlertComponent, ButtonComponent, InputFieldComponent],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="submit()" novalidate>
      @if (submitError()) {
        <app-alert [message]="submitError()!" />
      }

      <hr class="divider" />

      <div class="grid">
        <app-input-field
          label="ID"
          [control]="form.controls.id"
          [error]="fieldError('id')"
        />
        <app-input-field
          label="Nombre"
          [control]="form.controls.name"
          [error]="fieldError('name')"
        />
        <app-input-field
          label="Descripción"
          [control]="form.controls.description"
          [error]="fieldError('description')"
        />
        <app-input-field
          label="Logo"
          [control]="form.controls.logo"
          [error]="fieldError('logo')"
        />
        <app-input-field
          label="Fecha Liberación"
          type="date"
          [control]="form.controls.date_release"
          [error]="fieldError('date_release')"
        />
        <app-input-field
          label="Fecha Revisión"
          type="date"
          [control]="form.controls.date_revision"
          [error]="fieldError('date_revision')"
        />
      </div>

      <div class="actions">
        <app-button variant="outlined" type="button" (click)="cancel()">
          Cancelar
        </app-button>
        <app-button variant="secondary" type="button" (click)="resetForm()">
          Reiniciar
        </app-button>
        <app-button
          type="submit"
          [disabled]="form.invalid || form.pristine || submitting()"
        >
          {{ isEdit() ? 'Actualizar' : 'Enviar' }}
        </app-button>
      </div>
    </form>
  `,
  styles: [
    `
      .form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .divider {
        border: none;
        border-top: 1px solid var(--color-border);
        margin: 0;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 20px 24px;
      }

      .actions {
        display: flex;
        justify-content: center;
        gap: 16px;
        flex-wrap: wrap;
      }

      @media (max-width: 768px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class ProductFormComponent {
  readonly mode = input<'create' | 'edit'>('create');
  readonly productId = input<string | undefined>();
  readonly initialData = input<FinancialProduct | undefined>();

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly cases = inject(PRODUCT_USE_CASES);

  readonly submitError = signal<string | null>(null);
  readonly submitting = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      id: ['', [productIdValidator()]],
      name: ['', [productNameValidator()]],
      description: ['', [productDescriptionValidator()]],
      logo: ['', [requiredField()]],
      date_release: ['', [releaseDateValidator()]],
      date_revision: [{ value: '', disabled: true }, [revisionDateValidator()]],
    },
    { validators: [productFormValidator()] }
  );

  constructor() {
    effect(() => {
      this.applyInitialData();
    });

    this.form.controls.date_release.valueChanges.subscribe((releaseDate) => {
      if (!releaseDate) return;
      this.form.controls.date_revision.setValue(addRevisionYear(releaseDate));
      this.form.updateValueAndValidity();
    });

    this.form.controls.id.valueChanges.subscribe(() => {
      if (this.isEdit()) return;
      void this.verifyId();
    });
  }

  isEdit(): boolean {
    return this.mode() === 'edit';
  }

  fieldError(name: keyof typeof this.form.controls): string | null {
    const control = this.form.controls[name];
    if (name === 'date_revision' && this.form.errors?.['date_revision']) {
      if (control.dirty || control.touched || this.form.touched) {
        return String(this.form.errors['date_revision']);
      }
    }
    return getControlError(control);
  }

  async verifyId(): Promise<void> {
    const id = this.form.controls.id.value.trim();
    if (this.isEdit() || id.length < 3) return;

    const result = await this.cases.verifyProductId(id);
    if (!result.success) {
      this.form.controls.id.setErrors({ message: result.error });
      return;
    }
    if (result.value) {
      this.form.controls.id.setErrors({ message: 'ID no valido!' });
    }
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const raw = this.form.getRawValue();
    const product: FinancialProduct = {
      id: raw.id.trim(),
      name: raw.name.trim(),
      description: raw.description.trim(),
      logo: raw.logo.trim(),
      date_release: raw.date_release,
      date_revision: raw.date_revision,
    };

    const result =
      this.isEdit() && this.productId()
        ? await this.cases.updateProduct(this.productId()!, product)
        : await this.cases.createProduct(product);

    this.submitting.set(false);

    if (!result.success) {
      this.submitError.set(result.error);
      return;
    }

    await this.router.navigateByUrl('/');
  }

  cancel(): void {
    void this.router.navigateByUrl('/');
  }

  resetForm(): void {
    this.applyInitialData();
    this.submitError.set(null);
  }

  private applyInitialData(): void {
    const data = this.initialData() ?? emptyProductForm;
    this.form.reset(data);
    if (this.isEdit()) {
      this.form.controls.id.disable();
    } else {
      this.form.controls.id.enable();
    }
    this.form.controls.date_revision.disable();
    if (data.date_release) {
      this.form.controls.date_revision.setValue(addRevisionYear(data.date_release));
    }
  }
}
