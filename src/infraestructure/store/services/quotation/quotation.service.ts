import { LocalQuotationEntity, quotationService } from "@/data";
import type { QuotationEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { onSetCurrentQuotation } from "../../slices/quotation.slice";
import { onUpsertVersionQuotation } from "../../slices/versionQuotation.slice";

const PREFIX = "/quotation";

export const quotationServiceStore = createApi({
  reducerPath: "quotationService",
  tagTypes: ["Quotations", "Quotation"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getAllQuotations: builder.query<ApiResponse<QuotationEntity[]>, void>({
      query: () => "/",
      providesTags: ["Quotations"],
    }),
    createQuotation: builder.mutation<ApiResponse<QuotationEntity>, void>({
      query: () => ({
        url: "/",
        method: "POST",
      }),
      invalidatesTags: ["Quotations"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

       
          if (data.data.versions) {
            console.log(data.data.versions[0])
            dispatch(onUpsertVersionQuotation(data.data.versions[0]));
          }

          const transformedData = transformQuotation(data.data);

          await quotationService.upsertQuotation(transformedData);
          dispatch(onSetCurrentQuotation(transformedData));
        } catch (error) {
          console.error(error);
          throw error;
        }
      },
    }),
  }),
});

export const { useLazyGetAllQuotationsQuery, useCreateQuotationMutation } =
  quotationServiceStore;

const transformQuotation = (data: QuotationEntity): LocalQuotationEntity => {
  const version = data.versions?.[0];
  return {
    id: data.id,
    currentVersion: {
      id: version!.id,
    },
  };
};


