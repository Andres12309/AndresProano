import axios, { isAxiosError } from 'axios';
import type { FinancialProduct, ProductRepository } from '../domain/product';
import { environment } from '../environments/environment';

export const httpClient = axios.create({
  baseURL: environment.apiBase,
  headers: { 'Content-Type': 'application/json' },
});

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options?: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE'; body?: unknown }
): Promise<T> {
  const { method = 'GET', body } = options ?? {};

  try {
    const { data, status } = await httpClient.request<T>({
      url: path,
      method,
      data: body,
    });

    if (status === 204) return undefined as T;
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      const payload = error.response?.data as { message?: string } | undefined;
      const message = payload?.message ?? `Error ${status ?? 'desconocido'}`;
      throw new ApiError(message, status);
    }
    throw error;
  }
}

function normalizeDates<T extends { date_release: string; date_revision: string }>(
  item: T
): T {
  return {
    ...item,
    date_release: item.date_release.split('T')[0],
    date_revision: item.date_revision.split('T')[0],
  };
}

export class ProductApiRepository implements ProductRepository {
  async findAll(): Promise<FinancialProduct[]> {
    const { data } = await request<{ data: FinancialProduct[] }>('/products');
    return (data ?? []).map(normalizeDates);
  }

  async findById(id: string): Promise<FinancialProduct> {
    const product = await request<FinancialProduct>(`/products/${encodeURIComponent(id)}`);
    return normalizeDates(product);
  }

  async existsById(id: string): Promise<boolean> {
    return request<boolean>(`/products/verification/${encodeURIComponent(id)}`);
  }

  async create(product: FinancialProduct): Promise<void> {
    await request('/products', { method: 'POST', body: product });
  }

  async update(id: string, product: FinancialProduct): Promise<void> {
    await request(`/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: product,
    });
  }

  async delete(id: string): Promise<void> {
    await request(`/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }
}
