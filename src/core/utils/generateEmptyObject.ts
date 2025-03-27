import { z } from "zod";

export const generateEmptyObject = <T>(
  schema: z.ZodObject<any>,
  defaults: Record<string, any> = {},
): T => {
  const emptyState: any = {};

  for (const key in schema.shape) {
    const field = schema.shape[key];
    
    switch (field._def.typeName) {
      case "ZodString":
        emptyState[key] = defaults[key] ?? "";
        break;
      case "ZodNumber":
        emptyState[key] = defaults[key] ?? 0;
        break;
      case "ZodBoolean":
        emptyState[key] = defaults[key] ?? false;
        break;
      case "ZodDate":
        emptyState[key] = defaults[key] ?? new Date();
        break;
      case "ZodArray":
        emptyState[key] = defaults[key] ?? [];
        break;
      case "ZodObject":
        emptyState[key] = generateEmptyObject(field as z.ZodObject<any>, defaults[key] ?? {});
        break;
      case "ZodEnum":
      case "ZodNativeEnum":
        emptyState[key] = defaults[key] ?? "";
        break;
      case "ZodUnion":
        emptyState[key] = defaults[key] ?? undefined;
        break;
      case "ZodRecord":
        emptyState[key] = defaults[key] ?? {};
        break;
      case "ZodNull":
        emptyState[key] = defaults[key] ?? null;
        break;
      case "ZodUndefined":
        emptyState[key] = defaults[key] ?? undefined;
        break;
      case "ZodOptional":
        emptyState[key] = defaults[key] ?? undefined;
        break;
      case "ZodDefault":
        emptyState[key] = defaults[key] ?? undefined;
        break;
      default:
        emptyState[key] = ""; // Valor por defecto para tipos no manejados
    }
  }

  return emptyState;
};
