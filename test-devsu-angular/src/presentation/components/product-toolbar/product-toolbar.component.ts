import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-product-toolbar',
  standalone: true,
  imports: [RouterLink, ButtonComponent],
  template: `
    <div class="toolbar">
      <input
        type="search"
        class="search"
        placeholder="Search..."
        [value]="search()"
        (input)="searchChange.emit($any($event.target).value)"
        aria-label="Buscar productos"
      />
      <a routerLink="/products/new">
        <app-button>Agregar</app-button>
      </a>
    </div>
  `,
  styles: [
    `
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }

      .search {
        flex: 1;
        min-width: 220px;
        max-width: 360px;
        border: 1px solid var(--color-border);
        border-radius: 999px;
        padding: 10px 16px;
      }
    `,
  ],
})
export class ProductToolbarComponent {
  readonly search = input('');
  readonly searchChange = output<string>();
}
