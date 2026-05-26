import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  template: `
    <div class="skeleton">
      @for (row of rowsArray; track row) {
        <div class="row"></div>
      }
    </div>
  `,
  styles: [
    `
      .row {
        height: 48px;
        margin-bottom: 8px;
        border-radius: 4px;
        background: linear-gradient(90deg, #eef2f7 25%, #f8fafc 50%, #eef2f7 75%);
        background-size: 200% 100%;
        animation: shimmer 1.2s infinite;
      }

      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `,
  ],
})
export class ProductSkeletonComponent {
  readonly rows = input(5);

  get rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, index) => index);
  }
}
