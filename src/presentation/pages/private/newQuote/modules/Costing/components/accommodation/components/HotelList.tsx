import { MouseEvent, useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  InputText,
  Tag,
  InputNumber,
  DataView,
  Rating,
  Accordion,
  type AccordionTabChangeEvent,
  SelectButton,
  confirmPopup,
} from "@/presentation/components";
import { classNamesAdapter } from "@/core/adapters";
import {
  useHotelRoomQuotationStore,
  useHotelStore,
  useQuotationStore,
  useVersionQuotationStore,
} from "@/infraestructure/hooks";
import type { HotelEntity, HotelRoomEntity } from "@/domain/entities";
import { Divider } from "primereact/divider";
import { getHotelRoomRenderProperties } from "../utils";
import {
  useCreateHotelRoomQuotationMutation,
  useCreateManyHotelRoomQuotationsMutation,
} from "@/infraestructure/store/services";
import { Slider } from "primereact/slider";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store";
import { Day } from "@/infraestructure/store";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export const HotelList = ({ visible, setVisible }: Props) => {
  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const [createHotelRoomQuotation] = useCreateHotelRoomQuotationMutation();

  const { startCreateHotelRoomQuotation } = useHotelRoomQuotationStore();
  const { currentVersionQuotation } = useVersionQuotationStore();
  // const { selectedDay } = useQuotationStore();
  const { hotels } = useHotelStore();
  const [activeRoomRecord, setActiveRoomRecord] =
    useState<Record<number, number>>();
  const [selectedRoomRecord, setSelectedRoomRecord] = useState<
    Record<number, HotelRoomEntity | null>
  >({});
  const [peopleAmountRecord, setPeopleAmountRecord] =
    useState<Record<number, number>>();
  const [hotelsFiltered, setHotelsFiltered] = useState<HotelEntity[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hotelFilter, setHotelFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);
  const [hotelCategoryFilter, setHotelCategoryFilter] = useState<string>("");

  const handleAddHotelRoomQuotation = (index: number) => {
    const hotelRoom = selectedRoomRecord[index];
    const selectedPeopleAmount = peopleAmountRecord![index];

    createHotelRoomQuotation({
      versionQuotationId: currentVersionQuotation!.id,
      day: selectedDay!.number,
      hotelRoomId: hotelRoom!.id,
      numberOfPeople: selectedPeopleAmount,
    })
      .unwrap()
      .then(() => {
        setVisible(false);
      });
  };

  // console.log({currentVersionQuotation})

  const handleTabChange = (
    e: AccordionTabChangeEvent,
    hotelRoomPosition: number
  ) => {
    const index = Array.isArray(e.index) ? e.index[0] : e.index; // Capturamos el índice activo
    setActiveRoomRecord((prev) => {
      return {
        ...prev,
        [hotelRoomPosition]: index,
      };
    });

    const selectedRoom = hotelsFiltered[hotelRoomPosition].hotelRooms![index];

    if (index !== null) {
      setSelectedRoomRecord((prev) => {
        return {
          ...prev,
          [hotelRoomPosition]:
            prev[hotelRoomPosition] === selectedRoom ? null : selectedRoom,
        };
      });
      setPeopleAmountRecord((prev) => {
        return {
          ...prev,
          [hotelRoomPosition]: selectedRoom.capacity,
        };
      });
    }
  };

  const applyFilters = () => {
    let filtered = hotels;

    if (hotelFilter) {
      filtered = filtered.filter((hotel) =>
        hotel.name.toLowerCase().includes(hotelFilter.toLowerCase())
      );
    }

    if (ratingFilter > 0 || hotelCategoryFilter.length > 0) {
      filtered = filtered.filter((hotel) => {
        const category = isNaN(Number(hotel.category));
        if (!category) {
          // setHotelCategoryFilter("");
          return +hotel.category === ratingFilter;
        }
        // setRatingFilter(0);
        return hotel.category === hotelCategoryFilter;
      });
    }

    setHotelsFiltered(filtered);
  };

  const handleFilterByHotel = (value: string) => {
    setHotelFilter(value);
  };

  const handleFilterByRating = (value: number) => {
    setRatingFilter(value);
  };

  const handleFilterByCategory = (value: string) => {
    setHotelCategoryFilter(value);
  };

  useEffect(() => {
    setHotelsFiltered(hotels);

    setCategories(hotels.map((hotel) => hotel.category));
  }, [hotels]);

  useEffect(() => {
    applyFilters();
  }, [hotelFilter, ratingFilter, hotelCategoryFilter]);

  return (
    <Dialog
      header="Hoteles"
      visible={visible}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
      style={{ width: "50vw" }}
      breakpoints={{ "960px": "75vw", "641px": "100vw" }}
    >
      <div className="card">
        <DataView
          header={
            <>
              <div className="w-full md:max-w-sm mx-auto px-3">
                <InputText
                  label={{
                    text: "",
                    htmlFor: "search",
                  }}
                  iconField
                  iconFieldProps={{
                    iconPosition: "left",
                  }}
                  iconProps={{
                    className: "pi pi-search",
                  }}
                  placeholder="Buscar hotel..."
                  className="w-full"
                  type="search"
                  variant="filled"
                  onChange={(e) => handleFilterByHotel(e.target.value)}
                />
              </div>
              <div className="flex justify-center gap-x-4 mt-5">
                {categories.filter((category) => !isNaN(Number(category)))
                  .length > 0 && (
                  <Rating
                    value={ratingFilter}
                    onChange={(e) => {
                      const value = e.value ? (e.value > 3 ? e.value : 3) : 0;
                      handleFilterByRating(value);
                    }}
                    stars={5}
                  />
                )}

                {categories.filter((category) => isNaN(Number(category)))
                  .length > 0 && (
                  <SelectButton
                    value={hotelCategoryFilter}
                    options={categories
                      .filter((category) => isNaN(Number(category)))
                      .map((category) => ({
                        label: category,
                        value: category,
                      }))}
                    onChange={(e) => handleFilterByCategory(e.value ?? "")}
                  />
                )}
              </div>

              {/* <ConfirmPopup
              
              /> */}
              <div className="card flex justify-content-center">
                {/* <Button onClick={confirm1} icon="pi pi-check" label="Confirm" /> */}
              </div>

              {/* Filters */}
            </>
          }
          value={hotelsFiltered}
          listTemplate={(hotels: HotelEntity[]) => (
            <div className="grid gap-4 grid-cols-2 items-start mt-10">
              {hotels.map((hotel, index) => (
                <ListTemplate
                  key={index}
                  hotel={hotel}
                  index={index}
                  setVisible={setVisible}
                />
              ))}
            </div>
          )}
          // layout="flexgrid"
          paginator
          rows={3}
        />
      </div>
    </Dialog>
  );
};

const PopupWithLocalState = ({
  selectedDay,
  index,
  setRange,
}: {
  index: number;
  selectedDay: Day;
  setRange: (range: [number, number]) => void;
}) => {
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const [createHotelRoomQuotation] = useCreateHotelRoomQuotationMutation();
  const [localValue, setLocalValue] = useState<[number, number]>([1, 1]);

  const handleAddHotelRoomQuotation = () => {
    Array.from({ length: localValue[1] - localValue[0] + 1 }).forEach(
      (_, i) => {
        console.log({ i });
        // createHotelRoomQuotation({
        //   versionQuotationId: currentVersionQuotation!.id,
        //   day: selectedDay.number,
        //   hotelRoomId: 1,
        //   numberOfPeople: 1,
        // })
        //   .unwrap()
        //   .then(() => {
        //     setVisible(false);
        //   });
      }
    );
  };

  useEffect(() => {
    setRange(localValue);
  }, [localValue]);

  return (
    <div className="flex justify-center">
      <div className="w-48">
        <InputText
          label={{
            text: "Rango de de días",
            htmlFor: "range",
            className: "text-sm",
          }}
          value={`${localValue[0]} - ${localValue[1]}`}
          onChange={(e) =>
            setLocalValue(
              e.target.value.split(" - ").map((v) => Number(v)) as [
                number,
                number
              ]
            )
          }
          invalid={localValue[0] > localValue[1]}
          small={{
            className: "text-red-500",
            text: localValue[0] > localValue[1] ? "Rango inválido" : "",
          }}
          className="w-full"
        />

        <Slider
          min={1}
          max={selectedDay.total}
          range
          value={localValue}
          onChange={(e) =>
            setLocalValue(e.value as [number, number])
          }
          className="w-full"
        />
      </div>
    </div>
  );
};

const ListTemplate = ({
  hotel,
  index,
  setVisible,
}: {
  setVisible: (visible: boolean) => void;
  hotel: HotelEntity;
  index: number;
}) => {
  const { selectedDay } = useSelector((state: AppState) => state.quotation);
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );
  const [createManyHotelRoomQuotations] =
    useCreateManyHotelRoomQuotationsMutation();

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
    await createManyHotelRoomQuotations({
      versionQuotationId: currentVersionQuotation!.id,
      dayRange: rangeState,
      hotelRoomId: selectedRoom!.id,
      numberOfPeople: peopleAmount,
    })
      .unwrap()
      .then(() => {
        setVisible(false);
        setConfirm(false);
      }).catch((error) => {
        setConfirm(false);
      });
  };

  const confirm1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: (
        <PopupWithLocalState
          index={index}
          selectedDay={selectedDay!}
          setRange={setRangeState}
        />
      ),
      defaultFocus: "accept",
      accept: () => {
        setConfirm(true);
      },
    });
  };

  useEffect(() => {
    if (!confirm) return;

    handleAddHotelRoomQuotation().catch((error) => {
      console.error(error);
    });
  }, [rangeState, confirm]);

  return (
    <div className="p-6 border border-gray-300 bg-white rounded-lg shadow-md">
      {/* Hotel Details */}
      <div className="flex items-center justify-between gap-4">
        <header>
          <h5 className="text-2xl font-bold text-gray-900">{hotel.name}</h5>
          <p className="text-sm text-gray-600">{hotel.address}</p>
          <p className="text-sm text-gray-600">{hotel.email}</p>
          <div className="flex items-center gap-2 mt-2">
            <i className="pi pi-star-fill text-yellow-500"></i>
            <span className="text-lg font-medium text-gray-800">
              {hotel.category}
            </span>
          </div>
        </header>
        <div className="flex flex-col items-center gap-2">
          <InputNumber
            inputClassName="max-w-20"
            label={{ text: "" }}
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
            onClick={confirm1}
            // onClick={
            //   // (e) => confirm1(e, index)
            //   // handleAddHotelRoomQuotation(index)
            // }
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
          includeTab
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
                    className={classNamesAdapter(
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
              <div className="mt-3">
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
                    <li>USD: {room.priceUsd}</li>
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
