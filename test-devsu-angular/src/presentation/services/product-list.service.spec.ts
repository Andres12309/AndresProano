import { TestBed } from '@angular/core/testing';
import { fail, ok } from '../../application/result';
import type { ProductUseCases } from '../../application/product.use-cases';
import { PRODUCT_USE_CASES } from '../di/product.tokens';
import { ProductListService } from './product-list.service';

const mockProduct = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Descripcion valida de producto',
  logo: 'https://example.com/logo.png',
  date_release: '2023-02-01',
  date_revision: '2024-02-01',
};

const otherProduct = {
  ...mockProduct,
  id: 'cta-01',
  name: 'Cuenta Ahorro',
};

function createCases(overrides: Partial<ProductUseCases> = {}): ProductUseCases {
  return {
    getAllProducts: vi.fn().mockResolvedValue(ok([mockProduct, otherProduct])),
    getProductById: vi.fn(),
    verifyProductId: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn().mockResolvedValue(ok(undefined)),
    ...overrides,
  };
}

async function waitUntilLoaded(service: ProductListService): Promise<void> {
  for (let attempt = 0; attempt < 50 && service.loading(); attempt += 1) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
}

describe('ProductListService', () => {
  function setup(overrides: Partial<ProductUseCases> = {}) {
    const cases = createCases(overrides);
    TestBed.configureTestingModule({
      providers: [{ provide: PRODUCT_USE_CASES, useValue: cases }],
    });
    const service = TestBed.inject(ProductListService);
    return { service, cases };
  }

  it('carga los productos al iniciar', async () => {
    const { service } = setup();
    await waitUntilLoaded(service);
    expect(service.products()).toHaveLength(2);
  });

  it('muestra error cuando falla la carga', async () => {
    const { service } = setup({
      getAllProducts: vi.fn().mockResolvedValue(fail('API caida')),
    });
    await waitUntilLoaded(service);
    expect(service.error()).toBe('API caida');
    expect(service.loading()).toBe(false);
  });

  it('filtra por texto de busqueda', async () => {
    const { service } = setup();
    await waitUntilLoaded(service);
    service.setSearch('tarjeta');
    expect(service.totalResults()).toBe(1);
    expect(service.products()[0].id).toBe('trj-crd');
  });

  it('elimina producto despues de confirmar', async () => {
    const { service, cases } = setup();
    await waitUntilLoaded(service);

    service.openDelete(mockProduct);
    expect(service.toDelete()).toEqual(mockProduct);

    await service.confirmDelete();

    expect(cases.deleteProduct).toHaveBeenCalledWith('trj-crd');
    expect(service.toDelete()).toBeNull();
    expect(service.products().some((p) => p.id === 'trj-crd')).toBe(false);
  });

  it('guarda deleteError cuando falla la eliminacion', async () => {
    const { service } = setup({
      deleteProduct: vi.fn().mockResolvedValue(fail('No se pudo eliminar')),
    });
    await waitUntilLoaded(service);

    service.openDelete(mockProduct);
    await service.confirmDelete();

    expect(service.deleteError()).toBe('No se pudo eliminar');
    expect(service.toDelete()).toEqual(mockProduct);
  });
});
