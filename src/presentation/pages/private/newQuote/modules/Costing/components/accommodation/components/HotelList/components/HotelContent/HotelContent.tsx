import type { AppState } from "@/app/store";
import { cn } from "@/core/adapters";
import { type HotelEntity, type HotelRoomEntity } from "@/domain/entities";
import {
  useCreateManyHotelRoomTripDetailsMutation
} from "@/infraestructure/store/services";
import {
  Accordion,
  Button,
  confirmPopup,
  Divider,
  InputNumber,
  type AccordionTabChangeEvent,
} from "@/presentation/components";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { DaysNumberToAddRoom } from "./components";
import { getHotelRoomRenderProperties } from "./utils";

type Props = {
  hotel: HotelEntity;
  setVisible: (visible: boolean) => void;
};

export const HotelContent = ({ hotel, setVisible }: Props) => {
  const { days } = useSelector((state: AppState) => state.quotation);

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const [createManyHotelRoomTripDetails] =
    useCreateManyHotelRoomTripDetailsMutation();

  const [activeRoom, setActiveRoom] = useState<number>();
  const [selectedRoom, setSelectedRoom] = useState<HotelRoomEntity | null>();
  const [peopleAmount, setPeopleAmount] = useState<number>(0);
  const [rangeState, setRangeState] = useState<[number, number]>([1, 1]);
  const [confirm, setConfirm] = useState(false);

  const handleTabChange = (e: AccordionTabChangeEvent) => {
    const index = Array.isArray(e.index) ? e.index[0] : e.index; // Capturamos el índice activo
    setActiveRoom(index);

    const selectedRoom = hotel.hotelRooms![index];

    if (index !== null) {
      setSelectedRoom(selectedRoom);
      setPeopleAmount(selectedRoom.capacity);
    }
  };

  const handleAddHotelRoomQuotation = async () => {
    await createManyHotelRoomTripDetails({
      tripDetailsId: currentTripDetails!.id,
      dateRange: dateRange,
      hotelRoomId: selectedRoom!.id,
      numberOfPeople: peopleAmount,
    })
      .unwrap()
      .then(() => {
        setVisible(false);
        setConfirm(false);
      })
      .catch(() => {
        setConfirm(false);
      });
  };

  const handleConfirmAddDays = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: <DaysNumberToAddRoom setRange={setRangeState} />,
      defaultFocus: "accept",
      acceptLabel: "Aceptar",
      rejectLabel: "Cancelar",
      accept: () => {
        setConfirm(true);
      },
    });
  };

  const dateRange: [Date, Date] = useMemo(() => {
    const startDate = days[rangeState[0] - 1];
    const endDate = days[rangeState[1] - 1] ?? days[rangeState[0] - 1];
    // console.log(startDate, endDate);
    return [startDate.date, endDate.date];
  }, [days, rangeState]);

  useEffect(() => {
    if (!confirm) return;
    handleAddHotelRoomQuotation();
  }, [rangeState, confirm]);

  return (
    <div className="p-6 border border-gray-300 bg-white rounded-lg shadow-md">
      {/* Hotel Details */}
      <div className="flex items-center justify-between gap-4">
        <header>
          <h5 className="text-lg md:text-2xl font-bold text-gray-900">
            {hotel.name}
          </h5>
          <p className="text-sm text-gray-600">{hotel.address}</p>
          <p className="text-sm text-gray-600">{hotel.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <i className="pi pi-star-fill text-yellow-500"></i>
            <span className="text-sm md:text-lg font-medium text-gray-800">
              {hotel.category}
            </span>
          </div>
        </header>
        <div className="flex flex-col items-center gap-2">
          <InputNumber
            inputClassName="max-w-20"
            placeholder={
              selectedRoom ? "max " + selectedRoom?.capacity.toString() : ""
            }
            value={peopleAmount}
            disabled={!selectedRoom}
            onChange={(e) => setPeopleAmount(e.value ?? 0)}
            invalid={
              selectedRoom ? selectedRoom.capacity < peopleAmount : undefined
            }
          />
          <Button
            icon="pi pi-plus"
            rounded
            disabled={
              !selectedRoom ||
              selectedRoom.capacity < peopleAmount ||
              peopleAmount === 0
            }
            onClick={handleConfirmAddDays}
          />
        </div>
      </div>

      <Divider className="my-4" />

      {/* Room Section */}
      <section>
        <span className="block text-lg font-semibold text-gray-800">
          Habitaciones:
        </span>

        {hotel.hotelRooms?.length === 0 && (
          <p className="text-gray-500 mt-2 text-center bg-secondary p-2 rounded-md">
            No hay habitaciones disponibles
          </p>
        )}

        <Accordion
          className="mt-5"
          activeIndex={activeRoom}
          onTabClose={handleTabChange}
          onTabChange={handleTabChange}
          tabContent={hotel.hotelRooms?.map((room, idx) => ({
            header: (
              <div
                className="flex justify-between items-center gap-3"
                role="button"
                aria-expanded={activeRoom === idx ? "true" : "false"}
              >
                <div className="flex items-center gap-2">
                  <i
                    className={cn(
                      getHotelRoomRenderProperties(room, "icon"),
                      "font-bold text-gray-500"
                    )}
                  ></i>
                  <span className="font-medium text-gray-700">
                    {room.roomType}
                  </span>
                </div>
              </div>
            ),
            children: (
              <div className="max-md:text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-gray-700">
                    Capacidad para hasta{" "}
                    {room.capacity === 1
                      ? "1 persona"
                      : `${room.capacity} personas`}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="font-semibold text-gray-800">Precio:</p>
                  <ul className="list-disc pl-4">
                    <li>PEN: {room.pricePen}</li>
                    <li>USD: {room.rateUsd}</li>
                  </ul>
                </div>
              </div>
            ),
          }))}
        />
      </section>
    </div>
  );
};
