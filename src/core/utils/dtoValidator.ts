import { ZodError, type ZodType } from "zod";
import { constantEnvs } from "../constants/env.const";
const { ENV_MODE } = constantEnvs;
export const dtoValidator = <T>(
  dto: T,
  schema: ZodType<T>
): string[] | null => {
  try {
    schema.parse(dto);
  } catch (error) {
    if (ENV_MODE === "development") console.log(error);
    if (error instanceof ZodError) {
      return error.errors.map((error) => error.message);
    }
  }

  return null;
};
