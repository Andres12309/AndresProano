import { ok, fail, tryCatch } from "./result";

describe("resultado de operacones", () => {
  it("ok y fail devuelven la estrutura esperada", () => {
    expect(ok(42)).toEqual({ success: true, value: 42 });
    expect(fail("error")).toEqual({ success: false, error: "error" });
  });

  it("tryCatch retorna exitoo cuando la promesa resuelve", async () => {
    const result = await tryCatch(async () => "datos", "mensaje por defecto");
    expect(result).toEqual({ success: true, value: "datos" });
  });

  it("tryCatch usa el mensaje del Error cuando falla", async () => {
    const result = await tryCatch(async () => {
      throw new Error("API caida");
    }, "mensaje por defecto");
    expect(result).toEqual({ success: false, error: "API caida" });
  });

  it("tryCatch usa el mensaje por defecto si el error no es Error", async () => {
    const result = await tryCatch(async () => {
      throw "fallo";
    }, "mensaje por defecto");
    expect(result).toEqual({ success: false, error: "mensaje por defecto" });
  });
});
