import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="field">
      <label class="label" [attr.for]="controlId">{{ label() }}</label>
      <input
        [id]="controlId"
        [type]="type()"
        [formControl]="control()"
        [class.input-error]="!!error()"
        [class.input-disabled]="control().disabled"
        [attr.aria-invalid]="error() ? 'true' : null"
      />
      @if (error()) {
        <p class="error" role="alert">{{ error() }}</p>
      }
    </div>
  `,
  styles: [
    `
      .field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .label {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--color-text);
      }

      input {
        width: 100%;
        border: 1px solid var(--color-text);
        border-radius: 4px;
        padding: 10px 12px;
        background: #fff;
      }

      .input-error {
        border-color: var(--color-danger);
      }

      .input-disabled {
        background: var(--color-disabled-bg);
        color: var(--color-muted);
        border-color: var(--color-border);
      }

      .error {
        margin: 0;
        font-size: 0.8rem;
        color: var(--color-danger);
      }
    `,
  ],
})
export class InputFieldComponent {
  readonly label = input.required<string>();
  readonly control = input.required<FormControl>();
  readonly type = input('text');
  readonly error = input<string | null>(null);

  get controlId(): string {
    return `field-${this.label().replace(/\s+/g, '-').toLowerCase()}`;
  }
}
