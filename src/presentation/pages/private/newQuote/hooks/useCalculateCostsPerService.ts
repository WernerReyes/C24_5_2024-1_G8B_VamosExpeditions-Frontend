import { AppState } from "@/app/store";
import { HotelRoomTripDetailsEntity } from "@/domain/entities";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateCosts } from "../modules/utils";
import { CostTableType } from "../modules/types/costTable.type";
import { onSetHotelRoomTripDetailsWithTotalCost } from "@/infraestructure/store";

const EMPTY_HOTEL_ROOM_NAME = "SIN HABITACIONES";

export const useCalculateCostsPerService = () => {
  const dispatch = useDispatch();
  const { indirectCostMargin } = useSelector(
    (state: AppState) => state.quotation
  );
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { serviceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );

  const uniqueHotelRoomTripDetails: (HotelRoomTripDetailsEntity & {
    number: number;
  })[] = useMemo(() => {
    return hotelRoomTripDetails
      .map((quote) => {
        return {
          ...quote,
          number: hotelRoomTripDetails.filter(
            (t) =>
              t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
              t.hotelRoom?.roomType === quote.hotelRoom?.roomType
          ).length,
        };
      })
      .filter(
        (quote, index, self) =>
          index ===
          self.findIndex(
            (t) =>
              t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
              t.hotelRoom?.roomType === quote.hotelRoom?.roomType
          )
      );
  }, [hotelRoomTripDetails]);

  const calculateCostsPerService: CostTableType[] = useMemo(() => {
    const serviceCost = serviceTripDetails.reduce((acc, service) => {
      return acc + service.costPerson;
    }, 0);
    return calculateCosts(
      hotelRoomTripDetails,
      indirectCostMargin,
      serviceCost,
      EMPTY_HOTEL_ROOM_NAME
    );
  }, [hotelRoomTripDetails, indirectCostMargin]);

  useEffect(() => {
    dispatch(
      onSetHotelRoomTripDetailsWithTotalCost(
        uniqueHotelRoomTripDetails.length > 0
          ? uniqueHotelRoomTripDetails.map((quote, index) => {
              const totalCost =
                (
                  calculateCostsPerService[index]?.total as {
                    [key: string]: {
                      total: number;
                      indirectCost: number;
                      directCost: number;
                      totalCost: number;
                    };
                  }
                )[
                  `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`
                ]?.totalCost ?? 0;

              return {
                ...quote,
                totalCost,
              };
            })
          : [
              { 
                number: 0,
                totalCost:
                  (
                    calculateCostsPerService[0]?.total as {
                      [key: string]: {
                        total: number;
                        indirectCost: number;
                        directCost: number;
                        totalCost: number;
                      };
                    }
                  )?.[EMPTY_HOTEL_ROOM_NAME]?.totalCost ?? 0,
              },
            ]
      )
    );
  }, [uniqueHotelRoomTripDetails, calculateCostsPerService]);

  return {
    calculateCostsPerService,
    uniqueHotelRoomTripDetails,
    emptyHotelRoomName: EMPTY_HOTEL_ROOM_NAME,
  };
};
