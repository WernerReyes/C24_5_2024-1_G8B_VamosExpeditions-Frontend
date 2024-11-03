import { z } from "zod";
import { requestValidator } from "@/presentation/utilities";
import { type Message } from "../../responses/openAI";
import { OpenAIRoleEnum } from "@/domain/entities/enums";


type ChatRequestModel = {
  readonly messages: Message[];
};
export class ChatRequest implements ChatRequestModel {
  constructor(public readonly messages: Message[]) {}

  public validate() {
    requestValidator(this, ChatRequest.schema);
  }
  private static get schema(): z.ZodSchema<ChatRequestModel> {
    return ChatRequestSchema;
  }
}

const ChatRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z
        .nativeEnum(OpenAIRoleEnum)
        .refine((n) => Object.values(OpenAIRoleEnum).includes(n), {
          message: `role must be one of the following values: ${Object.values(OpenAIRoleEnum).join(", ")}`,
        }),
      content: z
        .string()
        .min(5, "content must have at least 5 characters")
        .max(500, "content must have a maximum of 500 characters"),
    }),
  ),
});
