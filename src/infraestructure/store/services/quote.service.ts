import { QuoteEntity } from "@/domain/entities";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const quoteService = createApi({
  reducerPath: "quoteService",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  endpoints: (builder) => ({
    getQuotes: builder.query<QuoteEntity[], void>({
      query: () => "/quotes",
    }),
  }),
});

export const { useLazyGetQuotesQuery } = quoteService;
