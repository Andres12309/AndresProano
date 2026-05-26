import { Component, input } from '@angular/core';
import { BankHeaderComponent } from '../bank-header/bank-header.component';

@Component({
  selector: 'app-bank-layout',
  standalone: true,
  imports: [BankHeaderComponent],
  template: `
    <div class="page">
      <div class="container">
        <app-bank-header />
        <main class="card">
          @if (title()) {
            <h1 class="title">{{ title() }}</h1>
          }
          <ng-content />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        padding: 32px 16px 48px;
      }

      .container {
        max-width: 1100px;
        margin: 0 auto;
      }

      .card {
        background: var(--color-surface);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-card);
        padding: 24px;
      }

      .title {
        margin: 0 0 16px;
        font-size: 1.25rem;
        font-weight: 700;
        padding-bottom: 12px;
        border-bottom: 1px solid var(--color-border);
      }
    `,
  ],
})
export class BankLayoutComponent {
  readonly title = input('');
}
