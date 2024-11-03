import { CategoryNotificationEnum } from "@/domain/entities/enums";
import {
  DishModelSchema,
  type NotificationData,
  UserModelSchema,
} from "@/model";
import { requestValidator } from "@/presentation/utilities";
import { z } from "zod";

type SendNotificationRequestModel = {
  readonly userIds: number[];
  readonly title: string;
  readonly details: string;
  readonly category: CategoryNotificationEnum;
  readonly data: NotificationData;
};

export class SendNotificationRequest implements SendNotificationRequestModel {
  constructor(
    public readonly userIds: number[],
    public readonly title: string,
    public readonly details: string,
    public readonly category: CategoryNotificationEnum,
    public readonly data: NotificationData,
  ) {}

  public validate(): void {
    requestValidator(this, SendNotificationRequest.schema);
  }

  public get toRequestBody(): Record<string, unknown> {
    return {
      title: this.title,
      details: this.details,
      category: this.category,
      data: JSON.stringify(this.data),
      userIds: this.userIds,
    };
  }
  public static get schema(): z.ZodSchema<SendNotificationRequestModel> {
    return SendNotificationRequestSchema;
  }
}

const SendNotificationRequestSchema = z.object({
  userIds: z
    .array(z.number({ message: "users must be an array of numbers" }))
    .nonempty(
      "users must be an array of numbers and must have at least one element",
    ),
  title: z
    .string({ message: "title must be a string and must not be empty" })
    .min(3, "message must have at least 3 characters")
    .max(100, "message must have at most 100 characters"),
  details: z
    .string({ message: "details must be a string" })
    .min(3, "details must have at least 3 characters"),
  category: z
    .nativeEnum(CategoryNotificationEnum, {
      message: "category must be a valid CategoryNotificationEnum",
    })
    .refine(
      (category) => Object.values(CategoryNotificationEnum).includes(category),
      {
        message:
          "category must have: " +
          Object.values(CategoryNotificationEnum).join(", "),
      },
    ),
  data: z.union([DishModelSchema, UserModelSchema]),
});
