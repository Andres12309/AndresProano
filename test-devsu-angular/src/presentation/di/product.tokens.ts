import { InjectionToken } from '@angular/core';
import type { ProductRepository } from '../../domain/product';
import type { ProductUseCases } from '../../application/product.use-cases';

export const PRODUCT_REPOSITORY = new InjectionToken<ProductRepository>('ProductRepository');
export const PRODUCT_USE_CASES = new InjectionToken<ProductUseCases>('ProductUseCases');
