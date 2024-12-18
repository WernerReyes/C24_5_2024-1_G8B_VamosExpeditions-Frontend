import { z } from "zod";

export const clientEntitySchema = z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string(),
    country: z.string(),
});

export type ClientEntity = z.infer<typeof clientEntitySchema>;

