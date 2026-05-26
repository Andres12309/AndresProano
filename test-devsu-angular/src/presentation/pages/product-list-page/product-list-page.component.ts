import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BankLayoutComponent } from '../../shared/layout/bank-layout/bank-layout.component';
import { AlertComponent } from '../../shared/ui/alert/alert.component';
import { DeleteProductModalComponent } from '../../components/delete-product-modal/delete-product-modal.component';
import { ProductSkeletonComponent } from '../../components/product-skeleton/product-skeleton.component';
import { ProductTableComponent } from '../../components/product-table/product-table.component';
import { ProductTableFooterComponent } from '../../components/product-table-footer/product-table-footer.component';
import { ProductToolbarComponent } from '../../components/product-toolbar/product-toolbar.component';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'app-product-list-page',
  standalone: true,
  imports: [
    BankLayoutComponent,
    AlertComponent,
    DeleteProductModalComponent,
    ProductSkeletonComponent,
    ProductTableComponent,
    ProductTableFooterComponent,
    ProductToolbarComponent,
  ],
  template: `
    <app-bank-layout>
      <app-product-toolbar
        [search]="list.search()"
        (searchChange)="list.setSearch($event)"
      />

      @if (list.error()) {
        <app-alert [message]="list.error()!" />
      }

      @if (list.loading()) {
        <app-product-skeleton [rows]="list.pageSize()" />
      } @else {
        <app-product-table
          [products]="list.products()"
          [progressPercent]="list.progressPercent()"
          (edit)="goEdit($event)"
          (deleteProduct)="list.openDelete($event)"
        />
        <app-product-table-footer
          [totalResults]="list.totalResults()"
          [pageSize]="list.pageSize()"
          [page]="list.page()"
          [totalPages]="list.totalPages()"
          (pageSizeChange)="list.setPageSize($event)"
          (pageChange)="list.setPage($event)"
        />
      }

      <app-delete-product-modal
        [product]="list.toDelete()"
        [deleting]="list.deleting()"
        [error]="list.deleteError()"
        (close)="list.closeDelete()"
        (confirm)="confirmDelete()"
      />
    </app-bank-layout>
  `,
})
export class ProductListPageComponent {
  readonly list = inject(ProductListService);
  private readonly router = inject(Router);

  goEdit(product: { id: string }): void {
    void this.router.navigate(['/products', product.id, 'edit']);
  }

  confirmDelete(): void {
    void this.list.confirmDelete();
  }
}
