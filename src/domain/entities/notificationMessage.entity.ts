import { z } from "zod";
import { userEntitySchema } from './user.entity';

export const notificationMessageEntitySchema = z.object({
    id: z.number(),
    from_user: z.number(),
    to_user: z.number(),
    message: z.string(),
    is_read: z.boolean(),
    created_at: z.string(),
    user:userEntitySchema.optional()
    
});

export type NotificationMessageEntity = z.infer<typeof notificationMessageEntitySchema>;