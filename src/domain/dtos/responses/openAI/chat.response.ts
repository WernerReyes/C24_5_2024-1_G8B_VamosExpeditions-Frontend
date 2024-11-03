import type { OpenAIRoleEnum } from "@/domain/entities/enums";

export type Message = {
  role: OpenAIRoleEnum;
  content: string;
};

type Choice = {
  message: Message;
};

export interface ChatResponse {
  id: string;
  created: number;
  choices: Choice[];
}
