import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  InputText,
  Tag,
  InputNumber,
  DataView,
  DataViewLayoutOptions,
  Rating,
} from "@/presentation/components";
import { classNamesAdapter } from "@/core/adapters";
import { AccommodationRoomEntity } from "@/domain/entities";
import {
  useAccommodationQuoteStore,
  useAccommodationRoomStore,
} from "@/infraestructure/hooks";
import { Day } from "../../Itineraty";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selectedDay: Day;
};

export const AccommodiationsList = ({
  visible,
  setVisible,
  selectedDay,
}: Props) => {
  const { accommodationRooms, startGetAllAccommodationRooms } =
    useAccommodationRoomStore();
  const { startSetLocalAccommodationQuote } = useAccommodationQuoteStore();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [value, setValue] = useState<number>(0);
  const [customerNumbers, setCustomerNumbers] = useState<Map<number, number>>();
  const [accommodationRoomsFiltered, setAccommodationRoomsFiltered] = useState<
    AccommodationRoomEntity[]
  >([]);
  const [hotelFilter, setHotelFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  const applyFilters = () => {
    let filtered = accommodationRooms;

    if (hotelFilter) {
      filtered = filtered.filter((room) =>
        room.accommodation.name
          .toLowerCase()
          .includes(hotelFilter.toLowerCase())
      );
    }

    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (room) => room.accommodation.rating === ratingFilter
      );
    }

    setAccommodationRoomsFiltered(filtered);
  };

  const handleCustomerNumbersChange = (index: number, value: number) => {
    const newCustomerNumbers = new Map(customerNumbers);
    newCustomerNumbers.set(index, value);
    setCustomerNumbers(newCustomerNumbers);
  };

  const handleFilterByHotel = (value: string) => {
    setHotelFilter(value);
  };

  const handleFilterByRating = (value: number) => {
    setRatingFilter(value);
  };

  useEffect(() => {
    startGetAllAccommodationRooms();
  }, []);

  useEffect(() => {
    setAccommodationRoomsFiltered(accommodationRooms);
    setCustomerNumbers(new Map(accommodationRooms.map((room) => [room.id, 0])));
  }, [accommodationRooms]);



  useEffect(() => {
    applyFilters();
  }, [hotelFilter, ratingFilter]);

  const listItem = (product: AccommodationRoomEntity, index: number) => {
    const id = customerNumbers?.get(product.id) ?? 0;
    return (
      <div className="w-full" key={product.id}>
        <div
          className={`flex flex-col xl:flex-row xl:items-start p-4 gap-4 ${
            index !== 0 ? "border-t border-gray-300" : ""
          }`}
        >
          <div className="flex flex-col sm:flex-row justify-between items-center xl:items-start flex-1 gap-4">
            <div className="flex flex-col items-center sm:items-start gap-3">
              <div className="text-2xl font-bold text-gray-900">
                {product.accommodation.name}
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`pi ${
                      i < product.accommodation.rating
                        ? "text-primary pi-star-fill"
                        : "text-primary pi-star"
                    }`}
                  ></i>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2">
                  <i className="pi pi-tag text-gray-500"></i>
                  <span className="font-semibold text-gray-700">
                    {product.roomType}
                  </span>
                </span>
                <Tag
                  value={product.available ? "DISPONIBLE" : "No DISPONIBLE"}
                  severity={product.available ? "success" : "danger"}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 my-5">
              <div className="flex items-center gap-3 my-5">
                <i
                  className={classNamesAdapter(
                    "pi",
                    product.capacity > 1 ? "pi-users" : "pi-user",
                    "text-gray-500 text-lg"
                  )}
                ></i>
                <span className="text-gray-700 text-sm">
                  {product.capacity !== 1
                    ? `${product.capacity} personas`
                    : `${product.capacity} persona`}
                </span>
              </div>
              <div>
                <InputNumber
                  label={{

                  }}
                  placeholder="Cant. Personas"
                  size={2}
                  className="w-36"
                  value={id}
                  onChange={(e) =>
                    handleCustomerNumbersChange(product.id, e.value ?? 0)
                  }
                  min={0}
                  invalid={id > product.capacity}
                  disabled={!product.available}
                />
              </div>
            </div>
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
              <span className="text-2xl font-semibold text-gray-900">
                ${product.priceUsd}
              </span>
              <Button
                rounded
                icon="pi pi-plus"
                disabled={
                  !product.available || id > product.capacity || id === 0
                }
                onClick={() => {
                  // console.log({
                  //   id: 0,
                  //   accommodationRoom: product,
                  //   customerNumber: customerNumbers[product.id],
                  //   day: selectedDayNumber,
                  //   versionQuotation: null,
                  // });
                  if (id === 0) return;
                  startSetLocalAccommodationQuote({
                    accommodationRoom: product,
                    customerNumber: id,
                    day: selectedDay.number,
                    versionQuotation: null,
                    date: selectedDay.date,
                  });

                  setTimeout(() => {
                    setVisible(false);
                  }, 1000);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // export interface AccommodationQuoteEntity {
  //   readonly id: number;
  //   readonly accommodationRoom: AccommodationRoomEntity
  //   readonly customerNumber: number;
  //   readonly total: number;
  //   readonly versionQuotation: null;
  //   readonly day: number;
  // }

  const gridItem = (product: AccommodationRoomEntity, index: number) => {
    const id = customerNumbers?.get(product.id) ?? 0;
    return (
      <div className="mt-5" key={index}>
        <div className="p-4 border border-gray-300 bg-white rounded-lg shadow">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <i className="pi pi-tag text-gray-500"></i>
              <span className="font-semibold text-gray-700">
                {product.roomType}
              </span>
            </div>
            <Tag
              value={product.available ? "DISPONIBLE" : "No DISPONIBLE"}
              severity={product.available ? "success" : "danger"}
            />
          </div>
          <div className="flex flex-col items-center gap-3 py-5">
            <div className="text-2xl font-bold text-gray-900">
              {product.accommodation.name}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`pi ${
                    i < product.accommodation.rating
                      ? "text-primary pi-star-fill"
                      : "text-primary pi-star"
                  }`}
                ></i>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between gap-3 my-5">
            <div className="flex items-center gap-3 my-5">
              <i
                className={classNamesAdapter(
                  "pi",
                  product.capacity > 1 ? "pi-users" : "pi-user",
                  "text-gray-500 text-lg"
                )}
              ></i>
              <span className="text-gray-700 text-sm">
                {product.capacity !== 1
                  ? `${product.capacity} personas`
                  : `${product.capacity} persona`}
              </span>
            </div>
            <div>
              <InputNumber
                label={{

                }}
                placeholder="Cant. Personas"
                size={2}
                className="w-36"
                value={id}
                onChange={(e) => {
                  handleCustomerNumbersChange(product.id, e.value ?? 0);
                }}
                min={0}
                invalid={id > product.capacity}
                disabled={!product.available}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-semibold text-gray-900">
              ${product.priceUsd}
            </span>
            <Button
              rounded
              icon="pi pi-plus"
              disabled={!product.available || id > product.capacity || id === 0}
              onClick={() => {
                // console.log({
                //   id: 0,
                //   accommodationRoom: product,
                //   customerNumber: customerNumbers[product.id],
                //   day: selectedDayNumber,
                //   versionQuotation: null,
                // });
                if (id === 0) return;
                startSetLocalAccommodationQuote({
                  accommodationRoom: product,
                  customerNumber: id,
                  day: selectedDay.number,
                  versionQuotation: null,
                  date: selectedDay.date,
                });

                setTimeout(() => {
                  setVisible(false);
                }, 1000);
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  const itemTemplate = (
    product: AccommodationRoomEntity,
    layout: "grid" | "list",
    index: number
  ) => {
    if (!product) {
      return;
    }

    if (layout === "list") return listItem(product, index);
    else if (layout === "grid") return gridItem(product, index);
  };

  const listTemplate = (
    products: AccommodationRoomEntity[],
    layout: "grid" | "list"
  ) => {
    return (
      <>
        {products.length === 0 ? (
          <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
            Ningún Hotel por ahora
          </p>
        ) : (
          <div
            className={classNamesAdapter(
              layout === "list"
                ? "p-grid"
                : "grid lg:grid-cols-2 gap-x-5 grid-nogutter"
            )}
          >
            {products.map((product, index) =>
              itemTemplate(product, layout, index)
            )}
          </div>
        )}
      </>
    );
  };

  const header = () => {
    return (
      <>
        <div className="flex justify-end">
          <DataViewLayoutOptions
            layout={layout}
            onChange={(e) => setLayout(e.value as any)}
          />
        </div>
        {/* Filters */}
        {/* Search Section */}

        <div className="flex gap-x-4 mt-5">
          <div>
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

          {/* <div>
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
                className: "pi pi-map-marker",
              }}
              placeholder="Ubicación..."
              className="w-full"
              type="search"
              variant="filled"
            />
          </div> */}

          <Rating
            value={value}
            onChange={(e) => {
              const value = e.value ?? 0;
              setValue(value);
              handleFilterByRating(value);
            }}
            stars={5}
            cancel={true}
          />
        </div>

        {/* Filters */}
      </>
    );
  };

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
          value={accommodationRoomsFiltered}
          listTemplate={listTemplate}
          layout={layout}
          header={header()}
          paginator
          rows={3}
        />
      </div>
    </Dialog>
  );
};
