import { createContext, useContext, type ReactNode } from "react";
import {
  createProductUseCases,
  type ProductUseCases,
} from "@/application/product.use-cases";
import { ProductApiRepository } from "@/infrastructure/product.api";

const ProductContext = createContext<ProductUseCases | null>(null);

const useCases = createProductUseCases(new ProductApiRepository());

export function ProductProvider({ children }: { children: ReactNode }) {
  return (
    <ProductContext.Provider value={useCases}>{children}</ProductContext.Provider>
  );
}

export function useProductUseCases(): ProductUseCases {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductUseCases requiere ProductProvider");
  return ctx;
}
