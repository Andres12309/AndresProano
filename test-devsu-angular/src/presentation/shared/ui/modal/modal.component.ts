import { Component, HostListener, input, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    @if (open()) {
      <div class="overlay" (click)="onClose.emit()" role="presentation">
        <div class="modal" role="dialog" aria-modal="true" (click)="$event.stopPropagation()">
          <div class="body">
            <ng-content />
          </div>
          @if (showFooter()) {
            <div class="footer">
              <ng-content select="[modal-footer]" />
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(55, 65, 81, 0.65);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 16px;
      }

      .modal {
        width: min(520px, 100%);
        background: var(--color-surface);
        border-radius: var(--radius-md);
        overflow: hidden;
        box-shadow: var(--shadow-card);
      }

      .body {
        padding: 28px 24px;
      }

      .footer {
        display: flex;
        gap: 12px;
        justify-content: center;
        padding: 16px 24px 24px;
        border-top: 1px solid var(--color-border);
      }
    `,
  ],
})
export class ModalComponent {
  readonly open = input(false);
  readonly showFooter = input(true);
  readonly onClose = output<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.onClose.emit();
  }
}
