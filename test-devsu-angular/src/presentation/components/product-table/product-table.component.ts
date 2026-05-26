import { Component, input, output, signal } from '@angular/core';
import type { FinancialProduct } from '../../../domain/product';
import { formatDisplayDate } from '../../../domain/dates';
import { ProductRowMenuComponent } from '../product-row-menu/product-row-menu.component';

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [ProductRowMenuComponent],
  template: `
    <div class="wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nombre del producto</th>
            <th>Descripción</th>
            <th>Fecha de liberación</th>
            <th>Fecha de reestructuración</th>
            <th aria-label="Acciones"></th>
          </tr>
        </thead>
        <tbody>
          @if (products().length === 0) {
            <tr>
              <td colspan="6" class="empty">No hay productos para mostrar.</td>
            </tr>
          } @else {
            @for (product of products(); track product.id) {
              <tr>
                <td class="logo-cell">
                  @if (product.logo && !logoFailed(product.id)) {
                    <img
                      [src]="product.logo"
                      [alt]="product.name"
                      class="logo"
                      (error)="markLogoFailed(product.id)"
                    />
                  } @else {
                    <span class="logo-fallback">{{ initials(product.name) }}</span>
                  }
                </td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>{{ formatDate(product.date_release) }}</td>
                <td>{{ formatDate(product.date_revision) }}</td>
                <td class="actions-cell">
                  <app-product-row-menu
                    [product]="product"
                    (editProduct)="edit.emit($event)"
                    (deleteProduct)="deleteProduct.emit($event)"
                  />
                </td>
              </tr>
            }
          }
        </tbody>
      </table>
      <div class="progress-bar" aria-hidden="true">
        <div class="progress-fill" [style.width.%]="progressPercent()"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        overflow-x: auto;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 14px 12px;
        text-align: left;
        border-bottom: 1px solid #eef2f7;
      }

      th {
        color: var(--color-primary);
      }

      .logo-cell {
        width: 72px;
      }

      .logo {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }

      .logo-fallback {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #dbeafe;
        font-weight: 700;
        font-size: 0.8rem;
      }

      .actions-cell {
        text-align: right;
        overflow: visible;
      }

      .empty {
        text-align: center;
        color: var(--color-muted);
        padding: 32px;
      }

      .progress-bar {
        height: 4px;
        background: #e5e7eb;
        margin-top: 4px;
      }

      .progress-fill {
        height: 100%;
        background: var(--color-primary);
      }
    `,
  ],
})
export class ProductTableComponent {
  readonly products = input<FinancialProduct[]>([]);
  readonly progressPercent = input(100);
  readonly edit = output<FinancialProduct>();
  readonly deleteProduct = output<FinancialProduct>();

  private readonly failedLogos = signal<Record<string, boolean>>({});

  formatDate = formatDisplayDate;

  initials(name: string): string {
    return name.slice(0, 2).toUpperCase() || 'PR';
  }

  logoFailed(id: string): boolean {
    return Boolean(this.failedLogos()[id]);
  }

  markLogoFailed(id: string): void {
    this.failedLogos.update((current) => ({ ...current, [id]: true }));
  }
}
