export interface FinancialProduct {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: string;
  date_revision: string;
}

export interface ProductRepository {
  findAll(): Promise<FinancialProduct[]>;
  findById(id: string): Promise<FinancialProduct>;
  existsById(id: string): Promise<boolean>;
  create(product: FinancialProduct): Promise<void>;
  update(id: string, product: FinancialProduct): Promise<void>;
  delete(id: string): Promise<void>;
}
