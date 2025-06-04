import {
  getServiceTypesDto,
  type GetServiceTypesDto,
} from "@/domain/dtos/serviceType";
import type { ServiceTypeEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { serviceTypeModel } from "../../../models/serviceType.model";
import { requestConfig } from "../config";
import type { ApiResponse } from "../response";
import { PaginatedResponse } from '../response';

const PREFIX = "/service-type";

export const serviceTypeService = createApi({
  reducerPath: "serviceTypeService",
  tagTypes: ["ServiceTypes"],
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    getServiceTypes: builder.query<
       ApiResponse<PaginatedResponse<ServiceTypeEntity>>,
      GetServiceTypesDto
    >({
      query: (params) => {
        const [_, errors] = getServiceTypesDto.create(params);
        if (errors) {
          throw errors;
        }
        return {
          url: "",
          method: "GET",
          params: {
            ...params,
            select: serviceTypeModel.toString(params.select),
          },
        };
      },
      providesTags: ["ServiceTypes"],
    }),

    // upsertServiceType: builder.mutation<ApiResponse<ServiceTypeEntity>, ServiceTypeDto>({
    //   query: (body) => {
    //     const [_, errors] = serviceTypeDto.create(body);
    //     if (errors) {
    //       throw errors;
    //     }
    //     return {
    //       url: `/${body.id ? body.id : ""}`,
    //       method: body.id ? "PUT" : "POST",
    //       body,
    //     };
    //   },
    //   invalidatesTags: ["ServiceTypes"],
    //   async onQueryStarted(_, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       startShowSuccess(data.message);
    //     } catch (error) {
    //       startShowApiError(error);
    //     }
    //   },
    // }),

    // deleteServiceType: builder.mutation<ApiResponse<ServiceTypeEntity>, string>({
    //   query: (id) => ({
    //     url: `/${id}`,
    //     method: "DELETE",
    //   }),
    //   invalidatesTags: ["ServiceTypes"],
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
  useGetServiceTypesQuery,
  // useUpsertServiceTypeMutation,
  // useDeleteServiceTypeMutation,
} = serviceTypeService;
