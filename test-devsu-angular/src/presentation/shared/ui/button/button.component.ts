import { Component, input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type()"
      [class]="buttonClass"
      [disabled]="disabled()"
    >
      <ng-content />
    </button>
  `,
  styles: [
    `
      button {
        border: none;
        border-radius: var(--radius-sm);
        padding: 10px 28px;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .primary {
        background: #f59e0b;
        color: #fff;
      }

      .secondary {
        background: #e5e7eb;
        color: var(--color-primary);
      }

      .danger {
        background: var(--color-danger);
        color: #fff;
      }

      .outlined {
        background: #e5e7eb;
        color: var(--color-primary);
        border: 1px solid #6b7280;
      }
    `,
  ],
})
export class ButtonComponent {
  readonly variant = input<'primary' | 'secondary' | 'danger' | 'outlined'>('primary');
  readonly type = input<'button' | 'submit'>('button');
  readonly disabled = input(false);
  readonly extraClass = input('');

  get buttonClass(): string {
    return `${this.variant()} ${this.extraClass()}`.trim();
  }
}
