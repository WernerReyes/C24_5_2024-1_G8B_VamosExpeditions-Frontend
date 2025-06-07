import { dtoValidator } from "@/core/utils";
import { z } from "zod";

const verify2FAAnfAuthenticateUserDtoSchema = z.object({
  userId: z.number().min(1).int(),
  code: z.string().min(6).max(6)
});

export type Verify2FAAnfAuthenticateUserDto = z.infer<
  typeof verify2FAAnfAuthenticateUserDtoSchema
>;

export const verify2FAAnfAuthenticateUserDto = {
  create: (
    dto: Verify2FAAnfAuthenticateUserDto
  ): [Verify2FAAnfAuthenticateUserDto?, string[]?] => {
    const errors = dtoValidator(dto, verify2FAAnfAuthenticateUserDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
};
