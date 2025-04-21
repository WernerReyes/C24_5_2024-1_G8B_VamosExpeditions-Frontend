import { dtoValidator } from "@/core/utils";
import { AllowVersionQuotationType } from "@/domain/entities";
import { z } from "zod";

export const sendEmailAndGenerateReportDtoSchema = z.object({
  subject: z.string().min(1, {
    message: "El campo asunto es requerido",
  }),
  to: z
    .array(
      z.object({
        email: z.string().email({
          message: "El campo email debe ser un correo válido",
        }),
        id: z.number().optional(),
      }),
      {
        required_error: "El campo para es requerido",
      }
    )
    .min(1, {
      message: "El campo para es requerido",
    }),
  resources: z.nativeEnum(AllowVersionQuotationType, {
    errorMap: () => ({ message: "El campo recursos es requerido" }),
  }),
  resourcesId: z.number().optional(),
  description: z.string().optional(),
  versionQuotationId: z.object({
    quotationId: z.number().min(1, {
      message: "El campo cotización es requerido",
    }),
    versionNumber: z.number().min(1, {
      message: "El campo versión es requerido",
    }),
  }),
  from: z.string().email({
    message: "El campo email debe ser un correo válido",
  }),
});

export type SendEmailAndGenerateReportDto = z.infer<
  typeof sendEmailAndGenerateReportDtoSchema
>;

export const sendEmailAndGenerateReportDto = {
  create: (
    dto: SendEmailAndGenerateReportDto
  ): [SendEmailAndGenerateReportDto?, string[]?] => {
    const errors = dtoValidator(dto, sendEmailAndGenerateReportDtoSchema);
    if (errors) {
      return [undefined, errors];
    }
    return [dto, undefined];
  },
  schema: sendEmailAndGenerateReportDtoSchema,
};
