import type { AppState } from "@/app/store";
import { constantStorage } from "@/core/constants";
import { useDeleteHotelRoomQuotationMutation } from "@/infraestructure/store/services";
import {
  Button,
  Column,
  DataTable,
  TabView,
  Tag,
} from "@/presentation/components";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { CostTableEnum } from "./enums/costTable.enum";
import { CostTableType } from "./types/costTable.type";
import { calculateCosts } from "./utils/calculateCosts";
import { HotelRoomQuotationEntity } from "@/domain/entities";

const { INDIRECT_COSTS_PERCENTAGE } = constantStorage;

export const CostSummaryModule = () => {
  const { hotelRoomQuotations } = useSelector(
    (state: AppState) => state.hotelRoomQuotation
  );
  const { selectedDay: currentDay } = useSelector(
    (state: AppState) => state.quotation
  );
  const [deleteHotelRoomQuotation] = useDeleteHotelRoomQuotationMutation();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [value, setValue] = useState<number>(
    localStorage.getItem(INDIRECT_COSTS_PERCENTAGE)
      ? Number(localStorage.getItem(INDIRECT_COSTS_PERCENTAGE))
      : 5
  );

  const hotelRoomQuotationsPerDay: HotelRoomQuotationEntity[] = useMemo(() => {
    return hotelRoomQuotations.filter((quote) => quote.day === selectedDay);
  }, [selectedDay, hotelRoomQuotations]);

  const uniqueHotelRoomQuotations: HotelRoomQuotationEntity[] = useMemo(() => {
    return hotelRoomQuotations.filter(
      (quote, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            t.hotelRoom?.hotel?.id === quote.hotelRoom?.hotel?.id &&
            t.hotelRoom?.roomType === quote.hotelRoom?.roomType
        )
    );
  }, [hotelRoomQuotations]);

  const calculateCostsPerService: CostTableType[] = useMemo(() => {
    return calculateCosts(hotelRoomQuotations, value);
  }, [hotelRoomQuotations, value]);

  const columsTable = useMemo(() => {
    return uniqueHotelRoomQuotations.map((quote) => ({
      field: "total",
      header: `${quote.hotelRoom?.hotel?.name}-${quote.hotelRoom?.roomType}`,
    }));
  }, [uniqueHotelRoomQuotations]);

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
                        <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 justify-items-center jus bg-white">
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
                                        deleteHotelRoomQuotation(quote.id)
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
                                    ${quote.hotelRoom?.rateUsd}
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

      <DataTable
        value={calculateCostsPerService}
        showGridlines

        header="Costos por Hotel"
      >
        <Column
          field="name"
          header="Nombre"
          headerClassName="bg-primary text-white"
          className="w-20"
          body={(rowData) => (
            <div>
              {rowData.name !== CostTableEnum.TOTAL_INDIRECT_COSTS ? (
                <div className="font-bold mb-2">{rowData.name}</div>
              ) : (
                <div className="flex items-center gap-x-5">
                  <div className="font-bold mb-2">Costos Indirectos</div>
                  <div className="">
                    <InputText
                      disabled
                      className="p-inputtext-sm w-full"
                      value={value.toString() + "%"}
                    />
                    <Slider
                      value={value}
                      min={0}
                      max={100}
                      onChange={(e) => {
                        setValue((e.value as number) ?? 5);
                        localStorage.setItem(
                          INDIRECT_COSTS_PERCENTAGE,
                          e.value.toString() ?? "5"
                        );
                      }}
                    />
                  </div>
                </div>
              )}

              {/* {renderCustomRow(rowData)} */}
            </div>
          )}
        ></Column>
        {columsTable.map((column, index) => (
          <Column
            key={index}
            headerClassName="bg-primary text-white"
            className="w-36"
            field={column.field}
            body={(rowData, { rowIndex }) => {
              return (
                <div className="font-bold">
                  {rowIndex === 0 && (
                    <>$ {rowData.total[column.header]?.serviceCost ?? 0}</>
                  )}

                  {rowIndex === 1 && (
                    <>$ {rowData.total[column.header]?.total ?? 0}</>
                  )}

                  {rowIndex === 2 && (
                    <>$ {rowData.total[column.header]?.directCost ?? 0}</>
                  )}
                  {rowIndex === 3 && (
                    <>
                      ${" "}
                      {rowData.total[column.header]?.indirectCost.toFixed(2) ??
                        0}{" "}
                    </>
                  )}

                  {rowIndex === 4 && (
                    <>$ {rowData.total[column.header]?.totalCost.toFixed(2) ?? 0} </>
                  )}
                </div>
              );
            }}
            header={column.header}
          />
        ))}
      </DataTable>

      {/* Tabla resumen */}
    </div>
  );
};
