import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse, PaginatedResponse } from "../response";
import { PartnerEntity } from "@/domain/entities";
import {
  getPartnersDto,
  GetPartnersDto,
} from "@/domain/dtos/partner/getPartner.dto";
import { partnerModel } from "@/infraestructure/models";
import { partnerDto, PartnerDto } from "@/domain/dtos/partner/partnet.dto";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { trashDto, TrashDto } from "@/domain/dtos/common";

const PREFIX = "/partner";
export const partnerService = createApi({
  reducerPath: "partnerService",
  tagTypes: ["Partners", "TrashPartners"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getPartnersAll: builder.query<
      ApiResponse<PaginatedResponse<PartnerEntity>>,
      GetPartnersDto
    >({
      query: (params) => {
        const [_, errors] = getPartnersDto.create(params);
        if (errors) throw errors;
        return {
          url: "/partners-all",
          method: "GET",
          params: {
            ...params,
            isDeleted: false,
            select: partnerModel.toString(params.select),
          },
        };
      },
      providesTags: ["Partners"],
    }),

    getTrashPartner: builder.query<
      ApiResponse<PaginatedResponse<PartnerEntity>>,
      GetPartnersDto
    >({
      query: (params) => {
        const [_, errors] = getPartnersDto.create(params);
        if (errors) throw errors;
        return {
          url: "/partners-all",
          method: "GET",
          params: {
            ...params,
            isDeleted: true,
            select: partnerModel.toString(params.select),
          },
        };
      },
      providesTags: ["TrashPartners"],
    }),

    upsertPartner: builder.mutation<ApiResponse<PartnerEntity>, PartnerDto>({
      query: (body) => {
        const [_, errors] = partnerDto.create(body);
        if (errors) throw errors;

        if (body.id !== 0) {
          return {
            url: `/${body.id}`,
            method: "PUT",
            body,
          };
        }

        return {
          url: "",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
          /* dispatch(
        partnerService.util.invalidateTags([
          { type: "Partners" },
        ])
      ); */
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
      invalidatesTags: [{ type: "Partners" }],
    }),

    trashPartner: builder.mutation<ApiResponse<PartnerEntity>, TrashDto>({
      query: (body) => {
        const [_, errors] = trashDto.create(body);
        if (errors) throw errors;

        return {
          url: `/${body.id}/trash`,
          method: "PUT",
          body: {
            deleteReason: body.deleteReason,
          },
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
      invalidatesTags: ["Partners", "TrashPartners"],
    }),

    restorePartner: builder.mutation<
      ApiResponse<PartnerEntity>,
      PartnerEntity["id"]
    >({
      query: (id) => {
        if (!id) throw new Error("ID is required");
        return {
          url: `/${id}/trash`,
          method: "PUT",
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
      invalidatesTags: ["Partners", "TrashPartners"],
    }),
  }),
});

export const {
  useGetPartnersAllQuery,
  useUpsertPartnerMutation,
  useGetTrashPartnerQuery,

  //! delete logic
  useTrashPartnerMutation,
  useRestorePartnerMutation,
} = partnerService;
