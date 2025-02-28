import type { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { HotelRoomTripDetailsEntity, VersionQuotationStatus } from "@/domain/entities";
import { useDeleteHotelRoomTripDetailsMutation, useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, Tag } from "@/presentation/components";
import { useSelector } from "react-redux";

type Props = {
  quote: HotelRoomTripDetailsEntity;
};

export const HotelListDetailsHeader = ({ quote }: Props) => {
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );
  const [deleteHotelRoomTripDetails] = useDeleteHotelRoomTripDetailsMutation();
  const [
    updateVersionQuotation,
  ] = useUpdateVersionQuotationMutation();

  const handleDelete = () => {
    deleteHotelRoomTripDetails(quote.id).then(({ data }) => {
       const restHotelRooms = hotelRoomTripDetails.filter((hotel) => hotel.id !== data!.data.id)
       if (restHotelRooms.length === 0) {
          updateVersionQuotation(versionQuotationDto.parse({
            ...currentVersionQuotation!,
            status: VersionQuotationStatus.DRAFT,
            finalPrice: undefined,
            profitMargin: undefined,
            indirectCostMargin: undefined,
            completionPercentage: 25,
          }));
        }     
    });
  };

  return (
    <div className="bg-primary text-white p-4 items-center justify-between">
      <div className="flex items-center justify-between">
        <Tag
          value="hotel"
          className="bg-white text-primary rounded-lg px-5 py-0"
        />
        <Button icon="pi pi-trash" onClick={handleDelete} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-6 h-6 hidden min-[350px]:flex sm:w-10 sm:h-10 sm:px-1 bg-white/20 rounded items-center justify-center">
            <i className="pi px-1 sm:text-xl pi-home"></i>
          </div>
          <div>
            <h2 className="text-xs sm:text-sm 2xl:text-lg 3xl:text-sm font-semibold">
              {quote.hotelRoom?.hotel?.name} - {quote.hotelRoom?.roomType}
            </h2>
            <small className="text-xs font-semibold text-secondary">
              <i className="pi text-xs pi-map-marker me-1"></i>
              {quote.hotelRoom?.hotel?.distrit?.city?.name}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};
