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
  Accordion,
  OrderList,
} from "@/presentation/components";
import { classNamesAdapter } from "@/core/adapters";
import {
  useAccommodationQuoteStore,
  useAccommodationRoomStore,
  useHotelStore,
} from "@/infraestructure/hooks";
import { Day } from "../../Itineraty";
import { HotelEntity } from "@/domain/entities";

/* interface Item {
  id: number;
  name: string;
}

const items: Item[] = [
  { id: 1, name: 'Manzana' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Cereza' },
]; */

interface Room {
  id_accommodation_room: number;
  room_type: string;
  price_usd: string;
  service_tax: string;
  rate_usd: string;
  price_pen: string;
  capacity: number;
  available: boolean;
  accommodation_id: number;
}

interface Accommodation {
  id_accommodation: number;
  name: string;
  category: string;
  address: string;
  rating: number;
  email: string;
  distrit_id_distrit: number;
  accommodation_room: Room[];
}

interface District {
  id_distrit: number;
  name: string;
  city_id: number;
  accommodation: Accommodation[];
}

// Definición del array `data`
const data: District[] = [
  {
    id_distrit: 1,
    name: "Usaquen",
    city_id: 1,
    accommodation: [
      {
        id_accommodation: 1,
        name: "Hotel 1",
        category: "5 Estrellas",
        address: "Calle 1",
        rating: 5,
        email: "hotel1@gmail.com",
        distrit_id_distrit: 1,
        accommodation_room: [
          {
            id_accommodation_room: 1,
            room_type: "SINGLE",
            price_usd: "100",
            service_tax: "0.18",
            rate_usd: "3.9",
            price_pen: "390",
            capacity: 1,
            available: true,
            accommodation_id: 1,
          },
          {
            id_accommodation_room: 2,
            room_type: "DOUBLE",
            price_usd: "150",
            service_tax: "0.18",
            rate_usd: "3.9",
            price_pen: "585",
            capacity: 2,
            available: true,
            accommodation_id: 1,
          },
          {
            id_accommodation_room: 3,
            room_type: "TRIPLE",
            price_usd: "300",
            service_tax: "0.18",
            rate_usd: "3.9",
            price_pen: "1170",
            capacity: 3,
            available: true,
            accommodation_id: 1,
          },
        ],
      },
    ],
  },
];

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  selectedDay: Day;
};

export const HotelList = ({
  visible,
  setVisible,
  selectedDay,
}: Props) => {
  // const { accommodationRooms, startGetAllAccommodationRooms } =
  //   useAccommodationRoomStore();
  const {
    hotels,
    startGetAllHotels,
    getHotelsResult: {
      isGettingAllHotels,
    }
  } = useHotelStore();

  const { startSetLocalAccommodationQuote } = useAccommodationQuoteStore();
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [value, setValue] = useState<number>(0);
  const [customerNumbers, setCustomerNumbers] = useState<Map<number, number>>();
  const [hotelsFiltered, setHotelsFiltered] = useState<
    HotelEntity[]
  >([]);
  const [hotelFilter, setHotelFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0);

  const applyFilters = () => {
    let filtered = hotels;

    if (hotelFilter) {
      filtered = filtered.filter((hotel) =>
        hotel.name
          .toLowerCase()
          .includes(hotelFilter.toLowerCase())
      );
    }

    if (ratingFilter > 0) {
      filtered = filtered.filter(
        (hotel) => hotel.rating === ratingFilter
      );
    }

    setHotelsFiltered(filtered);
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
    startGetAllHotels({});
  }, []);

  useEffect(() => {
    setHotelsFiltered(hotels);
    // setCustomerNumbers(new Map(accommodationRooms.map((room) => [room.id, 0])));
  }, [hotels]);

  useEffect(() => {
    applyFilters();
  }, [hotelFilter, ratingFilter]);

  const listItem = (product: HotelEntity, index: number) => {
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
                {product.name}
              </div>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`pi ${
                      i < product.rating
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
                    {product.category}
                  </span>
                </span>
                {/* <Tag
                  value={product.available ? "DISPONIBLE" : "No DISPONIBLE"}
                  severity={product.available ? "success" : "danger"}
                /> */}
              </div>
            </div>

            {/* <div className="flex items-center justify-between gap-3 my-5">
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
                  label={{}}
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
            </div> */}
            {/* <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2">
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
            </div> */}
          </div>
        </div>
      </div>
    );
  };

  const gridItem = (product: HotelEntity, index: number) => {
    const id = customerNumbers?.get(product.id) ?? 0;

    const [activeRoom, setActiveRoom] = useState<number | number[]>();

    const rooms = data
      .flatMap((district) => district.accommodation)
      .flatMap((accommodation) => accommodation.accommodation_room);
    

    const handleTabChange = (e: any) => {
      const index = Array.isArray(e.index) ? e.index[0] : e.index; // Capturamos el índice activo
      setActiveRoom(index);

      if (index !== null) {
        const selectedRoom = rooms[index];
        console.log("Datos de la habitación seleccionada:", selectedRoom);
      }
    };

    return (
      <div className="mt-5" key={index}>
        <div className="p-4 border border-gray-300 bg-white rounded-lg shadow">
          {/* <div className="flex flex-wrap items-center justify-between gap-2">
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
          </div> */}
          {/* <div className="flex flex-col items-center gap-3 py-5">
            <div className="text-2xl font-bold text-gray-900">
              {product.accommodation.name}
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`pi ${
                    i < product.accommodation.rating
                      ? "text-primary pi-star-fill "
                      : "text-primary pi-star"
                  }`}
                ></i>
              ))}
            </div>
          </div> */}
          {/* <div className="flex items-center justify-between gap-3 my-5">
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
                label={{}}
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
          </div> */}
{/* 
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
          </div> */}

          <Accordion
            includeTab
            
            className="mt-5"
            activeIndex={activeRoom}
            onTabChange={handleTabChange} // Captura del cambio
            tabContent={rooms.map((room) => ({
              header: `Tipo de Habitación: ${room.room_type}`, // Header dinámico
              children: (
                <div>
                  <p>Precio en USD: {room.price_usd}</p>
                  <p>Capacidad: {room.capacity} personas</p>
                  <p>Disponible: {room.available ? "Sí" : "No"}</p>
                </div>
              ),
            }))}
          />
        </div>
      </div>
    );
  };

  const itemTemplate = (
    product: HotelEntity,
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
    products: HotelEntity[],
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
            className=""
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
          value={hotelsFiltered}
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
/* const itemTemplate = (item: Item) => {
  return <div>{item.name}</div>;
};
 */
