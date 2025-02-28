import { startShowSuccess } from "@/core/utils";
import {
  // getTripDetailsDto,
  // GetTripDetailsDto,
  tripDetailsDto,
  TripDetailsDto,
} from "@/domain/dtos/tripDetails";
import { type TripDetailsEntity } from "@/domain/entities";
import { createApi } from "@reduxjs/toolkit/query/react";
import { onSetCurrentTripDetails } from "../../slices/tripDetails.slice";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";

const PREFIX = "/trip-details";

export const tripDetailsServiceStore = createApi({
  tagTypes: ["TripDetails", "TripDetail"],
  reducerPath: "tripDetailsServiceStore",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    upsertTripDetails: builder.mutation<
      ApiResponse<TripDetailsEntity>,
      {
        tripDetailsDto: TripDetailsDto;
        showMessage?: boolean;
        setCurrentTripDetails?: boolean;
      }
    >({
      query: ({ tripDetailsDto }) => {
        if (tripDetailsDto.id) {
          return {
            url: `/${tripDetailsDto.id}`,
            method: "PUT",
            body: tripDetailsDto,
          };
        }
        return {
          url: "/",
          method: "POST",
          body: tripDetailsDto,
        };
      },
      invalidatesTags: ["TripDetails"],
      async onQueryStarted(
        {
          tripDetailsDto: dto,
          showMessage = true,
          setCurrentTripDetails = true,
        },
        { dispatch, queryFulfilled }
      ) {
        try {
          //* Validate before sending
          const [_, errors] = tripDetailsDto.create(dto);
          if (errors) throw errors;
          const { data } = await queryFulfilled;
          if (setCurrentTripDetails)
            dispatch(onSetCurrentTripDetails(data.data));
          if (showMessage) startShowSuccess(data.message);
        } catch (error) {
          throw error;
        }
      },
    }),

    // getTripDetailsById: builder.query<ApiResponse<TripDetailsEntity>, number>({
    //   query: (id) => `/${id}`,
    //   providesTags: ["TripDetail"],
    //   // async onQueryStarted(args, { dispatch, queryFulfilled }) {
    //   //   try {
    //   //     console.log({ args });
    //   //     //* Validate before sending
    //   //     if (!args) return;

    //   //     const { data } = await queryFulfilled;
    //   //     console.log({ data });
    //   //     dispatch(onSetCurrentTripDetails(data.data));
    //   //     // startShowSuccess(data.message);
    //   //   } catch (error) {
    //   //     console.error(error);
    //   //     throw error;
    //   //   }
    //   // },
    // }),

    getTripDetailsByVersionQuotationId: builder.query<
      ApiResponse<TripDetailsEntity>,
      { quotationId: number; versionNumber: number }
    >({
      query: ({ quotationId, versionNumber }) => ({
        url: "/version-quotation",
        params: { quotationId, versionNumber },
      }),
      providesTags: ["TripDetail"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          //* Validate before sending
          if (!args) return;

          const { data } = await queryFulfilled;
          dispatch(onSetCurrentTripDetails(data.data));
          // startShowSuccess(data.message);
        } catch (error: any) {
          if (error.error.status === 404) {
            dispatch(onSetCurrentTripDetails(null));
          }
          throw error;
        }
      },
    }),

    // getAllTripDetails: builder.query<
    //   ApiResponse<TripDetailsEntity[]>,
    //   GetTripDetailsDto
    // >({
    //   query: (params) => {
    //     return {
    //       url: "/",
    //       params,
    //     };
    //   },
    //   providesTags: ["TripDetails"],
    //   async onQueryStarted(args, { dispatch, queryFulfilled }) {
    //     try {
    //       //* Validate before sending
    //       const [_, errors] = getTripDetailsDto.create(args);
    //       if (errors) throw errors;

    //       const { data } = await queryFulfilled;
    //       dispatch(onSetTripDetails(data.data));
    //       // startShowSuccess(data.message);
    //     } catch (error) {
    //       console.error(error);
    //       throw error;
    //     }
    //   },
    //   transformResponse: (response: ApiResponse<TripDetailsEntity[]>) => ({
    //     ...response,
    //     data: response.data.map((tripDetails) => ({
    //       ...tripDetails,
    //       startDate: dateFnsAdapter.parseISO(tripDetails.startDate as any),
    //       endDate: dateFnsAdapter.parseISO(tripDetails.endDate as any),
    //     })),
    //   }),
    // }),
  }),
});

export const {
  // useGetTripDetailsByIdQuery,
  // useGetAllTripDetailsQuery,
  // useLazyGetAllTripDetailsQuery,
  useUpsertTripDetailsMutation,
  useGetTripDetailsByVersionQuotationIdQuery,
} = tripDetailsServiceStore;
