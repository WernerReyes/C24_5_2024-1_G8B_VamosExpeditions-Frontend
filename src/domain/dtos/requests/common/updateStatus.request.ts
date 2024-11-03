import { StatusEnum } from "@/domain/entities/enums";
import { requestValidator } from "@/presentation/utilities";
import { z } from "zod";

type UpdateStatusRequestModel = {
  id: number;
  status: StatusEnum;
};

export class UpdateStatusRequest implements UpdateStatusRequestModel {
  constructor(
    public readonly id: number,
    public readonly status: StatusEnum,
  ) {}

  public validate() {
    requestValidator(this, UpdateStatusRequest.schema);
  }

  private static get schema(): z.ZodSchema<UpdateStatusRequestModel> {
    return updateStatusRequestSchema;
  }
}

const updateStatusRequestSchema = z.object({
  id: z
    .number({
      message: "id must be a number",
    })
    .int("id must be an integer")
    .positive("id must be positive"),
  status: z.nativeEnum(StatusEnum).refine(
    (status) => {
      return Object.values(StatusEnum).includes(status);
    },
    {
      message: `status must be one of: ${Object.values(StatusEnum).join(", ")}`,
    },
  ),
});
