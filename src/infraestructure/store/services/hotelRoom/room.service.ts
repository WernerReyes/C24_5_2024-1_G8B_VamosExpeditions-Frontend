import { createApi } from "@reduxjs/toolkit/query/react";
import { requestConfig } from "../config";
import { ApiResponse } from "../response";
import { HotelRoomEntity } from "@/domain/entities";
import { roomDto, RoomDto } from "@/domain/dtos/room";
import { startShowApiError, startShowSuccess } from "@/core/utils";
import { hotelService } from "../hotel/hotel.service";

const PREFIX = "/room";
export const roomService = createApi({
  reducerPath: "roomService",
  baseQuery: requestConfig(PREFIX),
  endpoints: (builder) => ({
    // start crate  and update room
    upsertRoom: builder.mutation<ApiResponse<HotelRoomEntity>, RoomDto>({
      query: (body) => {
        const [_, errors] = roomDto.create(body);
        if (errors) throw errors;

        if (body.roomId !== 0) {
          return {
            url: `/${body.roomId}`,
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
      async onQueryStarted({ }, { dispatch, queryFulfilled}) {
        try {
          const { data } = await queryFulfilled;
          startShowSuccess(data.message);
          dispatch(
            hotelService.util.invalidateTags([{ type: "HotelRoom" }])
          );
        } catch (error: any) {
          console.error(error);
          if (error.error) startShowApiError(error.error);
          throw error;
        }
      },
      
    }),
    // end create and update room
  }),
});

export const { useUpsertRoomMutation } = roomService;
