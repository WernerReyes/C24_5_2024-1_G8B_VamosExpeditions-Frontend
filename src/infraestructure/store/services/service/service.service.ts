import { getServicesDto, type GetServicesDto } from "@/domain/dtos/service";
import type { ServiceEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serviceModel } from "../../../models/service.model";
import { requestConfig } from "../config";
import type { ApiResponse, PaginatedResponse } from "../response";

const PREFIX = "/service";

export const serviceService = createApi({
  reducerPath: "serviceService",
  tagTypes: ["Services"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getServices: builder.query<ApiResponse<PaginatedResponse<ServiceEntity>>, GetServicesDto>({
      query: (params) => {
        const [_, errors] = getServicesDto.create(params);
        if (errors) {
          throw errors;
        }
        return {
          url: "",
          method: "GET",
          params: {
            ...params,
            select: serviceModel.toString(params.select),
          },
        };
      },
      providesTags: ["Services"],
    }),

    // upsertService: builder.mutation<ApiResponse<ServiceEntity>, ServiceDto>({
    //   query: (body) => {
    //     const [_, errors] = serviceDto.create(body);
    //     if (errors) {
    //       throw errors;
    //     }
    //     return {
    //       url: `/${body.id ? body.id : ""}`,
    //       method: body.id ? "PUT" : "POST",
    //       body,
    //     };
    //   },
    //   invalidatesTags: ["Services"],
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       startShowSuccess(data.message);
    //     } catch (error) {
    //       startShowApiError(error);
    //     }
    //   },
    // }),

    // deleteService: builder.mutation<ApiResponse<ServiceEntity>, string>({
    //   query: (id) => ({
    //     url: `/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["Services"],
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       startShowSuccess(data.message);
    //     } catch (error) {
    //       startShowApiError(error);
    //     }
    //   },
    // }),
  }),
});

export const {
  useGetServicesQuery,
  //   useUpsertServiceMutation,
  //   useDeleteServiceMutation,
} = serviceService;
