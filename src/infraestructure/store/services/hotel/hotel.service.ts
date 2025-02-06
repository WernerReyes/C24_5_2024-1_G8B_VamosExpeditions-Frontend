import { getHotelsDto, type GetHotelsDto } from "@/domain/dtos/hotel";
import type { HotelEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";

const PREFIX = "/hotel";

export const hotelService = createApi({
  reducerPath: "hotelService",
  tagTypes: ["Hotels", "Hotel"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getHotels: builder.query<ApiResponse<HotelEntity[]>, GetHotelsDto>({
      query: (getHotelsDto) => {
        return {
          url: "/",
          method: "GET",
          params: getHotelsDto,
        };
      },
      providesTags: ["Hotels"],
      async onQueryStarted(params, { queryFulfilled }) {
        const [_, errors] = getHotelsDto.create(params);
        if (errors) throw errors;
        try {
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
    }),
    getHotelPdf: builder.query<Blob, { id: number }>({
      query: ({ id }) => ({
        url: `/pdf/${id}`,  // Aquí pasamos el ID como parte de la URL
        method: "GET",      // Usamos el método GET
        responseHandler: (response) => response.blob(),  // Transformamos la respuesta en un Blob (archivo)
      }),
    }),
  }),
});

export const { useLazyGetHotelsQuery, useGetHotelsQuery,useGetHotelPdfQuery } = hotelService;
