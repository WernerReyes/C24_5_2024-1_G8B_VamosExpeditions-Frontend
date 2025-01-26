import { z } from "zod";

export const generateEmptyObject = <T>(
  schema: z.ZodObject<any>,
  defaults: Record<string, any> = {},
): T => {
  const emptyState: any = {};

  for (const key in schema.shape) {
    const field = schema.shape[key];

    if (field instanceof z.ZodString) {
      emptyState[key] = defaults[key] || "";
    } else if (field instanceof z.ZodNumber) {
      emptyState[key] = defaults[key] || 0;
    } else if (field instanceof z.ZodBoolean) {
      emptyState[key] = defaults[key] || false;
    } else if (field instanceof z.ZodDate) {
      emptyState[key] = defaults[key] || "";
    } else if (field instanceof z.ZodArray) {
      emptyState[key] = defaults[key] || [];
    } else if (field instanceof z.ZodObject) {
      emptyState[key] = generateEmptyObject(field, defaults[key] || {});
    } else if (field instanceof z.ZodEnum || field instanceof z.ZodNativeEnum) {
      emptyState[key] = defaults[key] || "";
    } else if (field instanceof z.ZodUnion) {
      emptyState[key] = defaults[key] || undefined;
    } else if (field instanceof z.ZodRecord) {
      emptyState[key] = defaults[key] || {};
    } else if (field instanceof z.ZodNull) {
      emptyState[key] = defaults[key] || null;
    } else if (field instanceof z.ZodUndefined) {
      emptyState[key] = defaults[key] || undefined;
    }
    else {
      emptyState[key] = ""; // Default case for unsupported types
    }
  }

  return emptyState;
};
