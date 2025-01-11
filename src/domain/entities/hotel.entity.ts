import { z } from "zod";

// Esquema para HotelRoom
const HotelRoomSchema = z.object({
  id: z.number(),
  roomType: z.string(),
  priceUsd: z.number(),
  serviceTax: z.number(),
  rateUsd: z.number(),
  pricePen: z.number(),
  capacity: z.number(),
  available: z.boolean(),
});

// Esquema para Hotel
const HotelSchema = z.object({
  name: z.string(),
  category: z.string(),
  address: z.string(),
  rating: z.number(),
  email: z.string().email(),
  hotelRoom: z.array(HotelRoomSchema),
});

// Esquema para Distrit
const DistritSchema = z.object({
  id: z.number(),
  name: z.string(),
  hotel: z.array(HotelSchema),
});

// Esquema para City
const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  distrit: z.array(DistritSchema),
});

export type HotelRoom = z.infer<typeof HotelRoomSchema>;
export type Hotel = z.infer<typeof HotelSchema>;
export type Distrit = z.infer<typeof DistritSchema>;
export type CityEntitys = z.infer<typeof CitySchema>;
