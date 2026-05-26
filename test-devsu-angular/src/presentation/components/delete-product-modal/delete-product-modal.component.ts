import { Component, input, output } from '@angular/core';
import type { FinancialProduct } from '../../../domain/product';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ButtonComponent } from '../../shared/ui/button/button.component';
import { ModalComponent } from '../../shared/ui/modal/modal.component';

@Component({
  selector: 'app-delete-product-modal',
  standalone: true,
  imports: [ModalComponent, AlertComponent, ButtonComponent],
  template: `
    <app-modal [open]="!!product()" (onClose)="close.emit()">
      @if (error()) {
        <app-alert [message]="error()!" />
      }
      <p class="message">
        Estas seguro de eliminar el producto <strong>{{ product()?.name }}</strong>?
      </p>
      <div modal-footer>
        <app-button variant="secondary" [disabled]="deleting()" (click)="close.emit()">
          Cancelar
        </app-button>
        <app-button variant="danger" [disabled]="deleting()" (click)="confirm.emit()">
          Confirmar
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [
    `
      .message {
        margin: 0;
      }
    `,
  ],
})
export class DeleteProductModalComponent {
  readonly product = input<FinancialProduct | null>(null);
  readonly deleting = input(false);
  readonly error = input<string | null>(null);
  readonly close = output<void>();
  readonly confirm = output<void>();
}
