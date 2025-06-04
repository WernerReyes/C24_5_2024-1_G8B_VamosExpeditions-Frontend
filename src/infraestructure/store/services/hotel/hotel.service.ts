import {
  getHotelsDto,
  hotelDto,
  HotelDto,
  HotelRoomDtoUnion,
  registerDto,
  type GetHotelsDto,
} from "@/domain/dtos/hotel";
import type { HotelEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import type { ApiResponse, PaginatedResponse } from "../response";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import {
  getHotelsPageDto,
  GetHotelsPageDto,
} from "@/domain/dtos/hotel/getHotelsPage.dto";
import { trashDto, TrashDto } from "@/domain/dtos/common";

const PREFIX = "/hotel";

export const hotelService = createApi({
  reducerPath: "hotelService",
  tagTypes: ["Hotels", "Hotel", "HotelRoom", "HotelAll", "HotelRoomTrash"],
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

    //! Upload Excel file and handle response  Hotel and room

    uploadExcelHotelAndRoom: builder.mutation<Blob | any, FormData>({
      query: (formData) => ({
        url: "/upload-excel-hotel-room",
        method: "POST",
        body: formData,
        responseHandler: async (response) => {
          const contentType = response.headers.get("content-type");
          console.log("contentType", contentType);
          if (contentType?.includes("application/json")) {
            const json = await response.json();

            return json;
          }
          let filename;
          const contentDisposition = response.headers.get(
            "content-disposition"
          );
          console.log("contentDisposition", contentDisposition);
          if (contentDisposition) {
            const match = contentDisposition.match(/filename="?([^"]+)"?/);
            console.log("match", match);
            if (match) {
              filename = match[1];
            }
          }
          const excel = await response.blob();
          return {
            blob: excel,
            filename: filename,
          };
        },
      }),

      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data && data.blob instanceof Blob) {
            const blobURL = URL.createObjectURL(data.blob);
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

      invalidatesTags: (result) => {
        if (!result) return [];
        const noInvalidate = new Set([
          "DATA IMPORTADA HOTEL",
          "CAMPOS VACIOS HOTEL",
          "CAMPOS VACIOS HABITACION",
          "NO EXIST DISTRIT",
          "NO EXIST HOTEL",
          "DATA EXISTENTE",
        ]);

        if (!result?.filename) return [];

        return noInvalidate.has(result.filename) ? [] : ["HotelRoom"];
      },
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

    //!get Hotel and room is_deleted=true
    getHotelsPageWithDetails: builder.query<
      ApiResponse<PaginatedResponse<HotelEntity>>,
      GetHotelsPageDto
    >({
      query: (params) => {
        const [_, errors] = getHotelsPageDto.create(params);
        if (errors) throw errors;
        return {
          url: "/page",
          method: "GET",
          params: {
            ...params,
            isDeleted: false,
          },
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

    //! end

    //!  getTrasheHotel and room
    getTrashHotelAndRoom: builder.query<
      ApiResponse<PaginatedResponse<HotelEntity>>,
      GetHotelsPageDto
    >({
      query: (params) => {
        const [_, errors] = getHotelsPageDto.create(params);
        if (errors) throw errors;
        return {
          url: "/page",
          method: "GET",
          params: {
            ...params,
            isDeleted: true,
          },
        };
      },
      providesTags: ["HotelRoomTrash"],
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          throw error;
        }
      },
      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),
    //! end

    //! use this to get all hotels form the room
    getHotelsAll: builder.query<ApiResponse<HotelEntity[]>, void>({
      query: () => ({
        url: "/hotel-all",
        method: "GET",
      }),
      providesTags: ["HotelAll"],

      keepUnusedDataFor: 1000 * 60 * 60, //* 1 hour
    }),

    //! start create , update and delete hotel
    upsertHotel: builder.mutation<ApiResponse<HotelEntity>, HotelDto>({
      query: (body) => {
        const [_, errors] = hotelDto.create(body);
        if (errors) throw errors;

        if (body.id !== 0) {
          return {
            url: `/${body.id}`,
            method: "PUT",
            body,
          };
        }

        return {
          url: "/",
          method: "POST",
          body,
        };
      },
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("data", data);
          startShowSuccess(data.message);
        } catch (error: any) {
          console.error(error);
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
      invalidatesTags: ["HotelRoom", "HotelAll"],
    }),
    //! delete logic
    trashHotel: builder.mutation<ApiResponse<HotelEntity>, TrashDto>({
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

          //userCache.trash(data.data, dispatch, getState as () => AppState);

          startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error) startShowApiError(error.error);
        }
      },
      invalidatesTags:(
        result, error, 
      )=>{
        if (!result) return [];
        if (error) return [];

        return ["HotelRoom", "HotelAll", "HotelRoomTrash"];
      },
    }),

    restoreHotel: builder.mutation<ApiResponse<HotelEntity>, HotelEntity["id"]>(
      {
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

            //userCache.trash(data.data, dispatch, getState as () => AppState);

            startShowSuccess(data.message);
          } catch (error: any) {
            if (error.error) startShowApiError(error.error);
          }
        },
        invalidatesTags: ["HotelRoom", "HotelAll", "HotelRoomTrash"],
      }
    ),

    //! end
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelsPageWithDetailsQuery,
  useGetHotelsAllQuery,
  useUploadExcelMutation,
  useRegisterHotelandRoomMutation,
  useUploadExcelHotelAndRoomMutation,

  //! start create and update hotel
  useUpsertHotelMutation,

  //! delete logic
  useTrashHotelMutation,
  useRestoreHotelMutation,
  useGetTrashHotelAndRoomQuery,
  //! end create and update hotel
} = hotelService;
