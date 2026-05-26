import type { FinancialProduct, ProductRepository } from "@/domain/product";
import { tryCatch, type Result } from "./result";

export const getAllProducts = (repo: ProductRepository) =>
  tryCatch(() => repo.findAll(), "No se pudieron cargar los productos.");

export const getProductById = (repo: ProductRepository, id: string) =>
  tryCatch(() => repo.findById(id), "No se pudo cargar el producto.");

export const verifyProductId = (repo: ProductRepository, id: string) =>
  tryCatch(() => repo.existsById(id), "No se pudo verificar el ID.");

export const createProduct = (repo: ProductRepository, product: FinancialProduct) =>
  tryCatch(() => repo.create(product), "No se pudo crear el producto.");

export const updateProduct = (
  repo: ProductRepository,
  id: string,
  product: FinancialProduct
) => tryCatch(() => repo.update(id, product), "No se pudo actualizar el producto.");

export const deleteProduct = (repo: ProductRepository, id: string) =>
  tryCatch(() => repo.delete(id), "No se pudo eliminar el producto.");

export type ProductUseCases = {
  getAllProducts: () => Promise<Result<FinancialProduct[]>>;
  getProductById: (id: string) => Promise<Result<FinancialProduct>>;
  verifyProductId: (id: string) => Promise<Result<boolean>>;
  createProduct: (product: FinancialProduct) => Promise<Result<void>>;
  updateProduct: (id: string, product: FinancialProduct) => Promise<Result<void>>;
  deleteProduct: (id: string) => Promise<Result<void>>;
};

export function createProductUseCases(repo: ProductRepository): ProductUseCases {
  return {
    getAllProducts: () => getAllProducts(repo),
    getProductById: (id) => getProductById(repo, id),
    verifyProductId: (id) => verifyProductId(repo, id),
    createProduct: (product) => createProduct(repo, product),
    updateProduct: (id, product) => updateProduct(repo, id, product),
    deleteProduct: (id) => deleteProduct(repo, id),
  };
}
