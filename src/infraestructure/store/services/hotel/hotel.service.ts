import {
  getHotelsDto,
  HotelRoomDtoUnion,
  registerDto,
  type GetHotelsDto,
} from "@/domain/dtos/hotel";
import type { HotelEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse, PaginatedResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { paginationDto, PaginationDto } from "@/domain/common";

const PREFIX = "/hotel";

export const hotelService = createApi({
  reducerPath: "hotelService",
  tagTypes: ["Hotels", "Hotel", "HotelRoom"],
  baseQuery: requestConfig(PREFIX),

  endpoints: (builder) => ({
    getHotels: builder.query<ApiResponse<HotelEntity[]>, GetHotelsDto>({
      query: (params) => {
        const [_, errors] = getHotelsDto.create(params);
        if (errors) throw errors;
        return {
          url: "/",
          method: "GET",
          params,
        };
      },
      providesTags: ["Hotels"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
<<<<<<< HEAD
    getHotelPdf: builder.query<Blob, { id: number }>({
      query: ({ id }) => ({
        url: `/pdf/${id}`,
        method: "GET",
        responseHandler: (response) => response.blob(),
      }),
    }),


    //* Upload Excel file and handle response *//
    uploadExcel: builder.mutation<Blob | any, FormData>({
      query: (formData) => ({
        url: "/upload-excel",
        method: "POST",
        body: formData,
        responseHandler: async (response) => {
          const contentType = response.headers.get("content-type");

          if (contentType?.includes("application/json")) {
            const json = await response.json();
            return json;
          }

          return response.blob();
        },
      }),



      onQueryStarted: async (_, { queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;

          if (data instanceof Blob) {
            const blobURL = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = blobURL;
            link.download = `Revisar_${new Date()
              .toLocaleString("sv-SE")
              .replace(" ", "_")
              .replace(/:/g, "-")}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobURL), 1000);
          }
        } catch (error: any) {
          startShowApiError(error.error);
        }
      },
    }),

    //* Upload Excel file and handle response  Hotel and room *//
    
    uploadExcelHotelAndRoom: builder.mutation<Blob | any, FormData>({
      query: (formData) => ({
        url: "/upload-excel-hotel-room",
        method: "POST",
        body: formData,
        responseHandler: async (response) => {
          const contentType = response.headers.get("content-type");
    
          if (contentType?.includes("application/json")) {
            const json = await response.json();
            return json;
          }
    
          return response.blob();
        },
      }),
    
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
    
          if (data instanceof Blob) {
            const blobURL = URL.createObjectURL(data);
            const link = document.createElement("a");
            link.href = blobURL;
            link.download = `Revisar_${new Date()
              .toLocaleString("sv-SE")
              .replace(" ", "_")
              .replace(/:/g, "-")}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => URL.revokeObjectURL(blobURL), 1000);
          }
    
          console.log("data", data);
        } catch (error: any) {
          startShowApiError(error.error);
        }
      },
    
      invalidatesTags: ["HotelRoom"], // ✅ Aquí va, fuera del query
    }),
    
    


    //
    registerHotelandRoom: builder.mutation<ApiResponse<any>, HotelRoomDtoUnion>(
      {
        query: (body) => {
          const [validatedData, errors] = registerDto.create(body);
          if (errors) throw errors;

          return {
            url: "/hotel-room",
            method: "POST",
            body: validatedData,
          };
        },

        async onQueryStarted(_, { queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            startShowSuccess(data.message);
          } catch (error: any) {
            console.error(error);
            if (error.error) startShowApiError(error.error);
            throw error;
          }
        },

        invalidatesTags: ["Hotels"],
      }
    ),


    //get Hotel and room
    getHotelsPageWithDetails: builder.query<
      ApiResponse<PaginatedResponse<HotelEntity>>,
      PaginationDto
    >({
      query: (params) => {
        const [_, errors] = paginationDto.create(params);
        if (errors) throw errors;
        return {
          url: "/page",
          method: "GET",
          params,
        };
      },
      providesTags: ["HotelRoom"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
    //
    getHotelsAll: builder.query<ApiResponse<HotelEntity[]>, void>({
      query: () => ({
        url: "/hotel-all",
        method: "GET",
      }),

      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
=======
>>>>>>> 53147d4b7dc5598ee724249add289ed54404fab2
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelsPageWithDetailsQuery,
  useGetHotelsAllQuery,
  useUploadExcelMutation,
  useRegisterHotelandRoomMutation,
  useUploadExcelHotelAndRoomMutation,
  
} = hotelService;
