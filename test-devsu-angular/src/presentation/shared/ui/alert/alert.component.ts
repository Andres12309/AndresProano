import { Component, input } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  template: `<div class="alert" role="alert">{{ message() }}</div>`,
  styles: [
    `
      .alert {
        margin: 0 0 16px;
        padding: 12px 16px;
        border-radius: var(--radius-sm);
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #991b1b;
      }
    `,
  ],
})
export class AlertComponent {
  readonly message = input.required<string>();
}
