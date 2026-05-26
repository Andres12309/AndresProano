import { z } from "zod";
import {
  addRevisionYear,
  isTodayOrFuture,
  toDateOnly,
} from "@/domain/dates";

export const productFormSchema = z
  .object({
    id: z
      .string()
      .min(1, "Este campo es requerido!")
      .min(3, "ID no válido!")
      .max(10, "ID no válido!")
      .regex(/^[a-zA-Z0-9-_]+$/, "ID no válido!"),
    name: z
      .string()
      .min(1, "Este campo es requerido!")
      .min(6, "Nombre no válido!")
      .max(100, "Nombre no válido!"),
    description: z
      .string()
      .min(1, "Este campo es requerido!")
      .min(10, "Descripción no válida!")
      .max(200, "Descripción no válida!"),
    logo: z.string().min(1, "Este campo es requerido!"),
    date_release: z
      .string()
      .min(1, "Este campo es requerido!")
      .refine(isTodayOrFuture, "La fecha debe ser igual o mayor a hoy!"),
    date_revision: z.string().min(1, "Este campo es requerido!"),
  })
  .superRefine((data, ctx) => {
    if (!data.date_release || !data.date_revision) return;
    const expected = addRevisionYear(data.date_release);
    if (toDateOnly(data.date_revision) !== expected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["date_revision"],
        message:
          "Debe ser exactamente un año después de la fecha de liberación!",
      });
    }
  });

export type ProductFormValues = z.infer<typeof productFormSchema>;

export const emptyProductForm: ProductFormValues = {
  id: "",
  name: "",
  description: "",
  logo: "",
  date_release: "",
  date_revision: "",
};
