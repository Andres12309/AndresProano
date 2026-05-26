import { Component } from '@angular/core';

@Component({
  selector: 'app-bank-header',
  standalone: true,
  template: `
    <header class="header">
      <div class="logo-row">
        <div class="icon" aria-hidden="true">
          <span></span>
          <span></span>
        </div>
        <h1 class="title">BANCO</h1>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 24px;
      }

      .logo-row {
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .icon {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2px;
      }

      .icon span {
        width: 14px;
        height: 18px;
        border-radius: 3px;
        background: var(--color-primary);
      }

      .icon span:nth-child(2) {
        transform: translateY(4px);
      }

      .title {
        margin: 0;
        font-size: 1.75rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        color: var(--color-primary);
      }
    `,
  ],
})
export class BankHeaderComponent {}
