import { ZodError, type ZodType } from "zod";

export const dtoValidator = <T>(dto: T, schema: ZodType<T>): string[] | null => {
  try {
    schema.parse(dto);
  } catch (error) {
    if (error instanceof ZodError)
      return error.errors.map((error) => error.message);
  }

  return null;
};
