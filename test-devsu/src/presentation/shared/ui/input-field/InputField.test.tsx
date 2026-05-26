import { render, screen } from "@testing-library/react";
import { InputField } from "./InputField";

describe("campo de entreada InputField", () => {
  it("muestra la etiqueta y el mensaje de error", () => {
    render(
      <InputField
        label="ID"
        name="id"
        error="ID no valido!"
        onChange={() => undefined}
      />
    );
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("ID no valido!");
  });

  it("marca el input como invalido cuando hay error", () => {
    render(
      <InputField
        label="Nombre"
        name="name"
        error="Nombre no valido!"
        onChange={() => undefined}
      />
    );
    expect(screen.getByLabelText("Nombre")).toHaveAttribute("aria-invalid", "true");
  });
});
