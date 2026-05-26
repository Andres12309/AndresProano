import { act, renderHook, waitFor } from "@testing-library/react";
import { fail, ok } from "@/application/result";
import type { ProductUseCases } from "@/application/product.use-cases";
import { useProducts } from "./use-products";

const mockProduct = {
  id: "trj-crd",
  name: "Tarjeta Credito",
  description: "Descripcion valida de producto",
  logo: "https://example.com/logo.png",
  date_release: "2023-02-01",
  date_revision: "2024-02-01",
};

const otherProduct = {
  ...mockProduct,
  id: "cta-01",
  name: "Cuenta Ahorro",
};

function createCases(
  overrides: Partial<ProductUseCases> = {}
): ProductUseCases {
  return {
    getAllProducts: jest.fn().mockResolvedValue(ok([mockProduct, otherProduct])),
    getProductById: jest.fn(),
    verifyProductId: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn().mockResolvedValue(ok(undefined)),
    ...overrides,
  };
}

async function renderLoadedHook(cases: ProductUseCases) {
  const hook = renderHook(() => useProducts(cases));
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  return hook;
}

describe("hook useProducts", () => {
  it("carga los productos al iniciar", async () => {
    const { result } = await renderLoadedHook(createCases());
    expect(result.current.products).toHaveLength(2);
  });

  it("muestra error cuando falla la carga", async () => {
    const cases = createCases({
      getAllProducts: jest.fn().mockResolvedValue(fail("API caida")),
    });
    const { result } = renderHook(() => useProducts(cases));
    await waitFor(() => expect(result.current.error).toBe("API caida"));
    expect(result.current.loading).toBe(false);
  });

  it("filtra por texto de busquda", async () => {
    const { result } = await renderLoadedHook(createCases());

    act(() => {
      result.current.setSearch("tarjeta");
    });

    expect(result.current.totalResults).toBe(1);
    expect(result.current.products[0].id).toBe("trj-crd");
  });

  it("elimina produto despues de confirmar", async () => {
    const cases = createCases();
    const { result } = await renderLoadedHook(cases);

    act(() => {
      result.current.openDelete(mockProduct);
    });

    await waitFor(() => expect(result.current.toDelete).toEqual(mockProduct));

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(cases.deleteProduct).toHaveBeenCalledWith("trj-crd");
    expect(result.current.toDelete).toBeNull();
    expect(result.current.products.some((p) => p.id === "trj-crd")).toBe(false);
  });

  it("guarda deleteError cuando falla la eliminacion", async () => {
    const cases = createCases({
      deleteProduct: jest.fn().mockResolvedValue(fail("No se pudo eliminar")),
    });
    const { result } = await renderLoadedHook(cases);

    act(() => {
      result.current.openDelete(mockProduct);
    });
    await waitFor(() => expect(result.current.toDelete).toEqual(mockProduct));

    await act(async () => {
      await result.current.confirmDelete();
    });

    expect(result.current.deleteError).toBe("No se pudo eliminar");
    expect(result.current.toDelete).toEqual(mockProduct);
  });
});
