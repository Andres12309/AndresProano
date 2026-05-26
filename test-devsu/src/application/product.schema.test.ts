import { addRevisionYear } from "@/domain/dates";

import { productFormSchema } from "./product.schema";

const validBase = {
  id: "trj-crd-1",
  name: "Tarjeta Credito 1",
  description: "Descripcion valida de producto 1",
  logo: "https://test-devsu.com/logo.png",
  date_release: "2026-06-15",
};

describe("esquema formulario produto", () => {
  it("acepta datos valios con revision un anio despues", () => {
    const result = productFormSchema.safeParse({
      ...validBase,

      date_revision: addRevisionYear(validBase.date_release),
    });

    expect(result.success).toBe(true);
  });

  it("rechyaza campos obligatorios vacios", () => {
    const result = productFormSchema.safeParse({
      id: "",
      name: "",
      description: "",
      logo: "",
      date_release: "",
      date_revision: "",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza formato de id invalido", () => {
    const result = productFormSchema.safeParse({
      ...validBase,
      id: "ab",
      date_revision: addRevisionYear(validBase.date_release),
    });

    expect(result.success).toBe(false);
  });

  it("rechaza nombre con menos de 6 caracteres alineado a API", () => {
    const result = productFormSchema.safeParse({
      ...validBase,
      name: "abcde",
      date_revision: addRevisionYear(validBase.date_release),
    });

    expect(result.success).toBe(false);
  });

  it("rechaza fecha de liberacion en el pasado", () => {
    const result = productFormSchema.safeParse({
      ...validBase,
      date_release: "2000-01-01",
      date_revision: "2001-01-01",
    });

    expect(result.success).toBe(false);
  });

  it("rechaza revision que no sea un anio despues de liberacion", () => {
    const result = productFormSchema.safeParse({
      ...validBase,
      date_revision: validBase.date_release,
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const revisionIssue = result.error.issues.find((i) =>
        i.path.includes("date_revision"),
      );

      expect(revisionIssue?.message).toContain("Debe ser exactamente");
    }
  });
});
