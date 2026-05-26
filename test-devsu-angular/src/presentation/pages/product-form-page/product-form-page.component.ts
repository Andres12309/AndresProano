import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import type { FinancialProduct } from '../../../domain/product';
import { PRODUCT_USE_CASES } from '../../di/product.tokens';
import { BankLayoutComponent } from '../../shared/layout/bank-layout/bank-layout.component';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductSkeletonComponent } from '../../components/product-skeleton/product-skeleton.component';

@Component({
  selector: 'app-product-form-page',
  standalone: true,
  imports: [BankLayoutComponent, AlertComponent, ProductFormComponent, ProductSkeletonComponent],
  template: `
    <app-bank-layout title="Formulario de Registro">
      @if (loadError()) {
        <app-alert [message]="loadError()!" />
      }
      @if (loading()) {
        <app-product-skeleton [rows]="3" />
      } @else {
        <app-product-form
          [mode]="isEdit ? 'edit' : 'create'"
          [productId]="productId()"
          [initialData]="initialData()"
        />
      }
    </app-bank-layout>
  `,
})
export class ProductFormPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cases = inject(PRODUCT_USE_CASES);

  readonly loading = signal(false);
  readonly loadError = signal<string | null>(null);
  readonly initialData = signal<FinancialProduct | undefined>(undefined);
  readonly productId = signal<string | undefined>(undefined);

  get isEdit(): boolean {
    return Boolean(this.productId());
  }

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.productId.set(id);

    if (id) {
      void this.loadProduct(id);
    }
  }

  private async loadProduct(id: string): Promise<void> {
    this.loading.set(true);
    const result = await this.cases.getProductById(id);
    this.loading.set(false);

    if (!result.success) {
      this.loadError.set(result.error);
      return;
    }

    this.initialData.set(result.value);
  }
}
