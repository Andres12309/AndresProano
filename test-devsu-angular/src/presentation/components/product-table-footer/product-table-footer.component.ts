import { Component, input, output } from '@angular/core';
import { PAGE_SIZES, type PageSize } from '../../constants/pagination';

@Component({
  selector: 'app-product-table-footer',
  standalone: true,
  template: `
    <footer class="footer">
      <p class="count">
        {{ totalResults() }} Resultado{{ totalResults() === 1 ? '' : 's' }}
      </p>
      <div class="controls">
        @if (totalPages() > 1) {
          <nav class="pagination" aria-label="Paginacion">
            <button type="button" [disabled]="page() <= 1" (click)="pageChange.emit(page() - 1)">
              &#8249;
            </button>
            <span>{{ page() }} / {{ totalPages() }}</span>
            <button
              type="button"
              [disabled]="page() >= totalPages()"
              (click)="pageChange.emit(page() + 1)"
            >
              &#8250;
            </button>
          </nav>
        }
        <select
          [value]="pageSize()"
          (change)="onPageSizeChange($event)"
          aria-label="Registros por pagina"
        >
          @for (size of pageSizes; track size) {
            <option [value]="size">{{ size }}</option>
          }
        </select>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        flex-wrap: wrap;
        gap: 12px;
      }

      .count {
        margin: 0;
        font-weight: 600;
        color: var(--color-primary);
      }

      .controls {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .pagination button {
        border: 1px solid var(--color-border);
        background: #fff;
        padding: 6px 10px;
        cursor: pointer;
      }

      .pagination button:disabled {
        opacity: 0.5;
      }

      .controls select {
        border: 1px solid var(--color-border);
        padding: 6px 10px;
        border-radius: 6px;
      }
    `,
  ],
})
export class ProductTableFooterComponent {
  readonly totalResults = input(0);
  readonly pageSize = input<PageSize>(5);
  readonly page = input(1);
  readonly totalPages = input(1);
  readonly pageSizeChange = output<PageSize>();
  readonly pageChange = output<number>();

  readonly pageSizes = PAGE_SIZES;

  onPageSizeChange(event: Event): void {
    const value = Number((event.target as HTMLSelectElement).value) as PageSize;
    this.pageSizeChange.emit(value);
  }
}
