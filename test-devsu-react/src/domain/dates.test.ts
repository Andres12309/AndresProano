import {
  addRevisionYear,
  formatDisplayDate,
  isTodayOrFuture,
  toDateOnly,
} from "./dates";

describe("fechas del dominio", () => {
  it("toDateOnly formatea fecha ISO a solo dia", () => {
    expect(toDateOnly("2024-06-15T10:00:00.000Z")).toBe("2024-06-15");
  });

  it("addRevisionYear suma un anio", () => {
    expect(addRevisionYear("2024-06-15")).toBe("2025-06-15");
  });

  it("isTodayOrFuture acepta fechas futuras", () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 2);
    expect(isTodayOrFuture(toDateOnly(future))).toBe(true);
  });

  it("isTodayOrFuture rechaza fechas pasadas", () => {
    expect(isTodayOrFuture("2000-01-01")).toBe(false);
  });

  it("formatDisplayDate devuelve DD/MM/YYYY", () => {
    expect(formatDisplayDate("2023-02-01")).toBe("01/02/2023");
  });

  it("formatDisplayDate devuelve el valor original si el formato es invaldio", () => {
    expect(formatDisplayDate("invalid")).toBe("invalid");
  });
});
