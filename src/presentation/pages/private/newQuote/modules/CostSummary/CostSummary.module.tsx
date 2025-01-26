import { HotelRoomQuotationEntity } from "@/domain/entities";
import {
  useHotelRoomQuotationStore,
  // useAccommodationQuoteStore,
  useQuotationStore,
} from "@/infraestructure/hooks";
import { Button, TabView, Tag } from "@/presentation/components";
import { Accordion, AccordionTab } from "primereact/accordion";
import { useEffect, useState } from "react";

export const CostSummaryModule = () => {
  const { selectedDay: currentDay } = useQuotationStore();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const {
    hotelRoomQuotations,
    startGetHotelRoomsQuotation,
    startDeleteHotelRoomQuotation,
  } = useHotelRoomQuotationStore();
  const [hotelRoomQuotationsPerDay, setHotelRoomQuotationsPerDay] = useState<
    HotelRoomQuotationEntity[]
  >([]);

  // useEffect(() => {
  //   startGetHotelRoomsQuotation();
  // }, []);

  useEffect(() => {
    if (selectedDay) {
      setHotelRoomQuotationsPerDay(
        hotelRoomQuotations.filter((quote) => quote.day === selectedDay)
      );
    }
  }, [selectedDay, hotelRoomQuotations]);

  return (
    <div className="p-6 w-full bg-gray-100">
      <TabView
        scrollable
        onBeforeTabChange={(e) => {
          setSelectedDay(e.index + 1);
        }}
        // activeIndex={selectedDay - 1}

        tabPanelContent={Array.from({ length: currentDay?.total ?? 0 }).map(
          (_, index) => ({
            header: `Día ${index + 1}`,
            leftIcon: "pi pi-calendar mr-2",
            children: (
              <>
                <Accordion multiple activeIndex={[1]}>
                  <AccordionTab header="Servicios">
                    <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                      Ningún alojamiento por ahora
                    </p>
                  </AccordionTab>
                  <AccordionTab header="Alojamientos" className="mt-4">
                    <div>
                      {hotelRoomQuotationsPerDay.length === 0 ? (
                        <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
                          Ningún alojamiento por ahora
                        </p>
                      ) : (
                        <div className="w-full grid lg:grid-cols-2 gap-x-4 gap-y-8 justify-items-center jus bg-white">
                          {hotelRoomQuotationsPerDay.map((quote) => (
                            <div
                              key={quote.id}
                              className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                            >
                              {/* Header */}
                              <div className="bg-primary text-white p-4 flex items-center justify-between">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-white/20  rounded flex items-center justify-center">
                                      <i className="pi text-xl pi-home"></i>
                                    </div>
                                    <div>
                                      <h2 className="text-xl font-semibold">
                                        {quote.hotelRoom?.hotel?.name} -{" "}
                                        {quote.hotelRoom?.roomType}
                                      </h2>
                                      <small className="text-xs font-semibold text-secondary">
                                        <i className="pi text-xs pi-map-marker me-1"></i>
                                        {
                                          quote.hotelRoom?.hotel?.distrit?.city
                                            ?.name
                                        }
                                      </small>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-red-5000 flex-col justify-center items-start">
                                  <Tag
                                    value="hotel"
                                    className="bg-white text-primary rounded-lg px-5 py-0"
                                  />
                                  <div className="flex items-center mt-1  justify-end">
                                    <Button
                                      icon="pi pi-trash"
                                      className="p-0 text-white"
                                      text
                                      onClick={() =>
                                        startDeleteHotelRoomQuotation(quote.id)
                                      }
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Body */}
                              <div className="p-4 border-t">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

                                    <span className="font-medium">Costo</span>
                                  </div>
                                  <span className="text-2xl font-bold text-primary">
                                    ${quote.hotelRoom?.priceUsd}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionTab>
                </Accordion>
              </>
            ),
          })
        )}
      />

      {/* Tabla resumen */}
      <div className="bg-white p-4 rounded shadow-md">
        {/* Tabla */}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Nombre</th>
              <th className="py-2">Hotel 1</th>
              <th className="py-2">Hotel 2</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Servicios Totales</td>
              <td className="py-2">$0</td>
              <td className="py-2">$0</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">AlojamientosTotales</td>
              <td className="py-2">$100</td>
              <td className="py-2">$200 </td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Total Costos Directos</td>
              <td className="py-2">0</td>
              <td className="py-2">0</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Total Costos Indirectos</td>
              <td className="py-2">0</td>
              <td className="py-2">0</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Total de Costos</td>
              <td className="py-2">0</td>
              <td className="py-2">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
