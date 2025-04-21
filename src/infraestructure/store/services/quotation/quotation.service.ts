import { LocalQuotationEntity, quotationService } from "@/data";
import type { QuotationEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { onSetCurrentQuotation } from "../../slices/quotation.slice";
import { versionQuotationCache } from "../versionQuotation/versionQuotation.cache";
import { AppState } from "@/app/store";

const PREFIX = "/quotation";

export const quotationServiceStore = createApi({
  reducerPath: "quotationService",
  tagTypes: ["Quotations", "Quotation"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    createQuotation: builder.mutation<ApiResponse<QuotationEntity>, void>({
      query: () => ({
        url: "/",
        method: "POST",
      }),
      invalidatesTags: ["Quotations"],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;

          const transformedData = transformQuotation(data.data);

          await quotationService.upsertQuotation(transformedData);
          dispatch(onSetCurrentQuotation(transformedData));

          versionQuotationCache.updateFromAnotherService(
            data.data!.versions![0],
            dispatch,
            getState as () => AppState
          );
        } catch (error) {
          throw error;
        }
      },
    }),
  }),
});

export const { useCreateQuotationMutation } = quotationServiceStore;

const transformQuotation = (data: QuotationEntity): LocalQuotationEntity => {
  const version = data.versions?.[0];
  return {
    id: data.id,
    currentVersion: {
      id: version!.id,
    },
  };
};
