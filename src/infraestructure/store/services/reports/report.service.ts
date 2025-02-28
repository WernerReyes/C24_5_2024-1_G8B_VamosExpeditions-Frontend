import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";

const PREFIX = "/reservation";

export const reportService = createApi({
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getHotelPdf: builder.query<Blob, { id: number }>({
      query: ({ id }) => ({
        url: `/pdf/${id}`, // Aquí pasamos el ID como parte de la URL
        method: "GET", // Usamos el método GET
        responseHandler: (response) => response.blob(), // Transformamos la respuesta en un Blob (archivo)
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          console.log("onQueryStarted", id);
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
    }),
  }),
});

export const { useGetHotelPdfQuery } = reportService;
