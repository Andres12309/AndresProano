import { computed, inject, Injectable, signal } from '@angular/core';
import type { FinancialProduct } from '../../domain/product';
import { PRODUCT_USE_CASES } from '../di/product.tokens';
import { PAGE_SIZES, type PageSize } from '../constants/pagination';

function filterByQuery(products: FinancialProduct[], query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.id, p.name, p.description].join(' ').toLowerCase().includes(q)
  );
}

@Injectable({ providedIn: 'root' })
export class ProductListService {
  private readonly cases = inject(PRODUCT_USE_CASES);

  private readonly allProducts = signal<FinancialProduct[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly search = signal('');
  readonly pageSize = signal<PageSize>(5);
  readonly page = signal(1);
  readonly toDelete = signal<FinancialProduct | null>(null);
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  readonly filtered = computed(() => filterByQuery(this.allProducts(), this.search()));
  readonly totalResults = computed(() => this.filtered().length);
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.totalResults() / this.pageSize())));
  readonly products = computed(() => {
    const start = (this.page() - 1) * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });
  readonly progressPercent = computed(() => {
    const total = this.totalResults();
    if (total === 0) return 0;
    return Math.min(100, (this.products().length / total) * 100);
  });

  constructor() {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    const result = await this.cases.getAllProducts();
    this.allProducts.set(result.success ? result.value : []);
    if (!result.success) this.error.set(result.error);
    this.loading.set(false);
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.page.set(1);
  }

  setPageSize(size: PageSize): void {
    this.pageSize.set(size);
    this.page.set(1);
  }

  setPage(page: number): void {
    const max = this.totalPages();
    this.page.set(Math.min(Math.max(1, page), max));
  }

  openDelete(product: FinancialProduct): void {
    this.toDelete.set(product);
    this.deleteError.set(null);
  }

  closeDelete(): void {
    if (this.deleting()) return;
    this.toDelete.set(null);
    this.deleteError.set(null);
  }

  async confirmDelete(): Promise<void> {
    const product = this.toDelete();
    if (!product) return;

    this.deleting.set(true);
    this.deleteError.set(null);
    const result = await this.cases.deleteProduct(product.id);
    this.deleting.set(false);

    if (!result.success) {
      this.deleteError.set(result.error);
      return;
    }

    this.allProducts.update((items) => items.filter((p) => p.id !== product.id));
    this.toDelete.set(null);
  }
}

export { PAGE_SIZES };
