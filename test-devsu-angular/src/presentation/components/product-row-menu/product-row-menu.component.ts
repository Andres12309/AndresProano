import {
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import type { FinancialProduct } from '../../../domain/product';

@Component({
  selector: 'app-product-row-menu',
  standalone: true,
  template: `
    <div class="menu">
      <button
        #trigger
        type="button"
        class="trigger"
        [attr.aria-expanded]="open()"
        aria-haspopup="menu"
        (click)="toggle()"
      >
        &#8942;
      </button>
      @if (open()) {
        <div class="dropdown" [style]="menuStyle()" role="menu">
          <button type="button" role="menuitem" (click)="edit()">Editar</button>
          <button type="button" role="menuitem" class="danger" (click)="remove()">
            Eliminar
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .menu {
        position: relative;
        display: inline-block;
      }

      .trigger {
        border: none;
        background: transparent;
        cursor: pointer;
        font-size: 1.25rem;
      }

      .dropdown {
        position: fixed;
        min-width: 120px;
        background: #fff;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-card);
        z-index: 200;
      }

      .dropdown button {
        display: block;
        width: 100%;
        border: none;
        background: #fff;
        padding: 10px 12px;
        text-align: left;
        cursor: pointer;
      }

      .danger {
        color: var(--color-danger);
      }
    `,
  ],
})
export class ProductRowMenuComponent {
  readonly product = input.required<FinancialProduct>();
  readonly editProduct = output<FinancialProduct>();
  readonly deleteProduct = output<FinancialProduct>();

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly triggerRef = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  readonly open = signal(false);
  readonly menuStyle = signal<Record<string, string>>({});

  toggle(): void {
    if (this.open()) {
      this.open.set(false);
      return;
    }

    const rect = this.triggerRef()?.nativeElement.getBoundingClientRect();
    if (!rect) return;

    const menuHeight = 88;
    const gap = 4;
    const openUp = rect.bottom + menuHeight > window.innerHeight && rect.top > menuHeight;

    this.menuStyle.set(
      openUp
        ? {
            top: `${rect.top - gap}px`,
            left: `${rect.right}px`,
            transform: 'translate(-100%, -100%)',
          }
        : {
            top: `${rect.bottom + gap}px`,
            left: `${rect.right}px`,
            transform: 'translateX(-100%)',
          }
    );
    this.open.set(true);
  }

  edit(): void {
    this.open.set(false);
    this.editProduct.emit(this.product());
  }

  remove(): void {
    this.open.set(false);
    this.deleteProduct.emit(this.product());
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }
}
