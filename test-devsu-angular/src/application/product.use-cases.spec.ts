import type { FinancialProduct, ProductRepository } from '../domain/product';
import {
  createProduct,
  createProductUseCases,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  verifyProductId,
} from './product.use-cases';

const product: FinancialProduct = {
  id: 'trj-crd',
  name: 'Tarjeta Credito',
  description: 'Descripcion valida de producto',
  logo: 'https://example.com/logo.png',
  date_release: '2099-01-01',
  date_revision: '2100-01-01',
};

function createRepo(overrides: Partial<ProductRepository> = {}): ProductRepository {
  return {
    findAll: vi.fn().mockResolvedValue([product]),
    findById: vi.fn().mockResolvedValue(product),
    existsById: vi.fn().mockResolvedValue(false),
    create: vi.fn().mockResolvedValue(undefined),
    update: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('casos de uso de producto', () => {
  it('getAllProducts responde con exito', async () => {
    const repo = createRepo();
    const result = await getAllProducts(repo);
    expect(result.success).toBe(true);
    if (result.success) expect(result.value).toHaveLength(1);
  });

  it('getAllProducts responde con error si el repositorio falla', async () => {
    const repo = createRepo({
      findAll: vi.fn().mockRejectedValue(new Error('red caida')),
    });
    const result = await getAllProducts(repo);
    expect(result).toEqual({ success: false, error: 'red caida' });
  });

  it('getProductById responde con exito y con error', async () => {
    const okResult = await getProductById(createRepo(), 'trj-crd');
    expect(okResult.success).toBe(true);

    const failResult = await getProductById(
      createRepo({ findById: vi.fn().mockRejectedValue(new Error('404')) }),
      'x'
    );
    expect(failResult.success).toBe(false);
  });

  it('verifyProductId responde con exito y con error', async () => {
    const okResult = await verifyProductId(createRepo(), 'trj-crd');
    expect(okResult).toEqual({ success: true, value: false });

    const failResult = await verifyProductId(
      createRepo({ existsById: vi.fn().mockRejectedValue(new Error('fallo')) }),
      'x'
    );
    expect(failResult.success).toBe(false);
  });

  it('createProduct responde con exito y con error', async () => {
    const repo = createRepo();
    const okResult = await createProduct(repo, product);
    expect(okResult.success).toBe(true);
    expect(repo.create).toHaveBeenCalledWith(product);

    const failResult = await createProduct(
      createRepo({ create: vi.fn().mockRejectedValue(new Error('duplicado')) }),
      product
    );
    expect(failResult.success).toBe(false);
  });

  it('updateProduct responde con exito y con error', async () => {
    const repo = createRepo();
    const okResult = await updateProduct(repo, 'trj-crd', product);
    expect(okResult.success).toBe(true);

    const failResult = await updateProduct(
      createRepo({ update: vi.fn().mockRejectedValue(new Error('error')) }),
      'trj-crd',
      product
    );
    expect(failResult.success).toBe(false);
  });

  it('deleteProduct responde con exito y con error', async () => {
    const repo = createRepo();
    const okResult = await deleteProduct(repo, 'trj-crd');
    expect(okResult.success).toBe(true);

    const failResult = await deleteProduct(
      createRepo({ delete: vi.fn().mockRejectedValue(new Error('error')) }),
      'trj-crd'
    );
    expect(failResult.success).toBe(false);
  });

  it('createProductUseCases enlaza todos los metodos del repositorio', async () => {
    const repo = createRepo();
    const cases = createProductUseCases(repo);

    await cases.getAllProducts();
    await cases.getProductById('trj-crd');
    await cases.verifyProductId('trj-crd');
    await cases.createProduct(product);
    await cases.updateProduct('trj-crd', product);
    await cases.deleteProduct('trj-crd');

    expect(repo.findAll).toHaveBeenCalled();
    expect(repo.delete).toHaveBeenCalledWith('trj-crd');
  });
});
