import { z } from "zod";
import { clientEntitySchema } from "./client.entity";
import { cityEntitySchema } from "./city.entity";

export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  COMPLETED = "COMPLETED",
  PENDING = "PENDING",
}

export enum TravelerStyle {
  STANDARD = "STANDARD",
  COMFORT = "COMFORT",
  LUXUS = "LUXUS",
}

export enum OrderType {
  DIRECT = "DIRECT",
  INDIRECT = "INDIRECT",
}

const reservationEntitySchema = z.object({
  id: z.number().int().positive().min(1),
  client: clientEntitySchema,
  numberOfPeople: z.number(),
  startDate: z.date(),
  endDate: z.date(),
  code: z.string(),
  travelerStyle: z.nativeEnum(TravelerStyle),
  orderType: z.nativeEnum(OrderType),
  status: z.nativeEnum(ReservationStatus),
  specialSpecifications: z.string().optional(),
  cities: z.array(cityEntitySchema),
});

export type ReservationEntity = z.infer<typeof reservationEntitySchema>;
