import { useGetCountriesAndCityAndDistritsQuery } from "@/infraestructure/store/services";
import {
  Badge,
  Button,
  DataTable,
  type DataTableExpandedRows,
  type DataTableValueArray,
  DefaultFallBackComponent,
  ErrorBoundary,
  Skeleton,
} from "@/presentation/components";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { Row } from "primereact/row";
import { FilterApplyButton, FilterClearButton } from "../filters";
import { useEffect, useState } from "react";
import type { CityEntity, CountryEntity } from "@/domain/entities";
import { CountryTable } from "./city/CityTable";
import { Toolbar } from "primereact/toolbar";
import { CountryEditAndRegisterModal } from "./CountryEditAndRegisterModal";

import { TableCountryActions } from "./TableCountryActions";

const CountryPage = () => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);

  const [selectedCountries, setSelectedCountries] = useState<CountryEntity[]>(
    []
  );

  // start new country modal
  const [isModalOpen, setModalOpen] = useState(false);
  const [rowData, setRowData] = useState<CountryEntity>({} as CountryEntity);
  // end new country modal

  // start new city modal

  // end new city modal
  // start apis
  const {
    data: allCountryAndCityAndDistrits,
    isFetching,
    isLoading,
    refetch,
    isError,
  } = useGetCountriesAndCityAndDistritsQuery();
  // end apis

  useEffect(() => {
    if (!isError) return;
    const tdEmpty = document.querySelector(
      "#fallback-country-table .p-datatable-emptymessage td"
    );

    if (tdEmpty) {
      tdEmpty.setAttribute("colspan", "12");
    }
  }, [isError]);

  return (
    <div
      className="bg-gradient-to-br 
     from-slate-50 via-white 
     to-slate-50 p-10 rounded-2xl 
     shadow-[0_0_50px_rgba(0,0,0,0.05)] 
     overflow-x-hidden border border-slate-100"
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold 
        bg-gradient-to-r from-primary
        to-teal-500 bg-clip-text text-transparent mb-3"
        >
          Gestión de Territorios
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl">
          Administra países, ciudades y distritos en el sistema
        </p>
      </div>

      <Toolbar
        className="mb-6"
        end={
          <>
            <Button
              icon="pi pi-plus"
              label="Nuevo País"
              tooltip="Añadir nuevo país"
              tooltipOptions={{ position: "top" }}
              onClick={() => {
                setRowData({} as CountryEntity);
                setModalOpen(true);
              }}
            />

            {/* start new Country */}
            <CountryEditAndRegisterModal
              rowData={rowData}
              showModal={isModalOpen}
              setShowModal={setModalOpen}
            />
            {/* end new Country */}

            {/* start new city */}
          </>
        }
        start={
          <Button
            icon="pi pi-trash"
            className="bg-gradient-to-r from-rose-500 to-red-500
               hover:from-rose-600 hover:to-red-600
                border-none shadow-md shadow-rose-200 transition-all duration-300"
            label={`Eliminar (${selectedCountries.length})`}
            disabled={selectedCountries.length === 0}
            tooltip="Eliminar seleccionados"
            tooltipOptions={{ position: "top" }}
          />
        }
      />

      <ErrorBoundary
        isLoader={isFetching || isLoading}
        loadingComponent={
          <DataTable
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            showGridlines
            headerColumnGroup={headerColumnGroup}
            value={Array.from({
              length: Array.isArray(allCountryAndCityAndDistrits?.data)
                ? allCountryAndCityAndDistrits?.data.length
                : 10,
            })}
            lazy
            size="small"
            emptyMessage={"No hay hoteles"}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Column
                key={i}
                field={`loading-${i}`}
                header="Cargando..."
                body={() => <Skeleton shape="rectangle" height="1.5rem" />}
              />
            ))}
          </DataTable>
        }
        fallBackComponent={
          <DataTable
            pt={{
              header: {
                className: "!bg-secondary",
              },
            }}
            id="fallback-country-table"
            showGridlines
            headerColumnGroup={headerColumnGroup}
            value={[]}
            lazy
            size="small"
            emptyMessage={
              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
                message="No se pudieron cargar los hoteles"
              />
            }
          />
        }
        error={isError}
      >
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-lg bg-white">
          <DataTable
            scrollable
            size="small"
            stateStorage="custom"
            value={allCountryAndCityAndDistrits?.data || []}
            filterDisplay="menu"
            editMode="cell"
            dataKey="id"
            className="text-sm lg:text-[15px]"
            pt={{
              header: {
                className:
                  "bg-gradient-to-r from-slate-50 to-white border-b border-slate-100",
              },
              wrapper: {
                className: "rounded-xl",
              },
              tbody: {
                className: "bg-white",
              },
            }}
            onRowToggle={(e) => setExpandedRows(e.data)}
            expandedRows={expandedRows}
            selection={selectedCountries}
            onSelectionChange={(e) =>
              setSelectedCountries(e.value as CountryEntity[])
            }
            rowExpansionTemplate={(data: CountryEntity) => (
              <CountryTable rowData={data} />
            )}
            emptyMessage={"No hay países registrados"}
          >
            <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
            <Column
              expander
              headerStyle={{ width: "3rem" }}
              pt={{
                rowToggler: {
                  className:
                    "w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors duration-200",
                },
              }}
            />

            <Column
              field="name"
              header="Nombre"
              headerClassName="font-semibold text-slate-700"
              style={{ width: "40%" }}
              filter
              body={(rowData) => {
                return (
                  <div className="flex gap-4 items-center">
                    <i
                      className="pi pi-globe text-lg
                        bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-2 
                      "
                    />

                    <div>
                      <span className="font-semibold text-slate-800 text-base">
                        {rowData.name}
                      </span>
                      <div className="text-sm text-slate-500 mt-1">
                        {rowData.cities?.length || 0} ciudades ·{" "}
                        {rowData.cities?.reduce(
                          (acc: number, city: CityEntity) =>
                            acc + (city.distrits?.length || 0),
                          0
                        ) || 0}{" "}
                        distritos
                      </div>
                    </div>
                  </div>
                );
              }}
              filterField="name"
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
              filterPlaceholder="Buscar nombre del país"
              filterClear={(options) => <FilterClearButton {...options} />}
              filterApply={(options) => <FilterApplyButton {...options} />}
            />
            <Column
              field="Tipo"
              header="Tipo"
              style={{ width: "30%" }}
              filter
              filterMenuStyle={{ width: "16rem" }}
              showFilterMatchModes={false}
              showFilterOperator={false}
              showAddButton={false}
              filterField="category"
              body={(rowData) => {
                return (
                  <Badge
                    className="text-white
                     bg-emerald-500 
                    "
                    severity={"success"}
                    size={"normal"}
                    value={rowData.code}
                  />
                );
              }}
              filterPlaceholder="Buscar código"
              filterClear={(options) => <FilterClearButton {...options} />}
              filterApply={(options) => <FilterApplyButton {...options} />}
            />

            <Column
              header="Acciones"
              headerClassName="font-semibold text-slate-700 text-right"
              style={{ width: "30%" }}
              body={(data: CountryEntity) => (
                <TableCountryActions rowData={data} />
              )}
            />
          </DataTable>
        </div>
      </ErrorBoundary>
    </div>
  );
};

const headerColumnGroup = (
  <ColumnGroup>
    <Row>
      <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
      <Column expander style={{ width: "3rem" }} />
      <Column
        header="Nombre"
        field="name"
        headerClassName="font-semibold text-slate-700"
        style={{ width: "40%" }}
      />
      <Column
        header="Tipo"
        field="code"
        headerClassName="font-semibold text-slate-700"
        style={{ width: "30%" }}
      />
      <Column
        header="Acciones"
        headerClassName="font-semibold text-slate-700 text-right"
        style={{ width: "30%" }}
      />
    </Row>
  </ColumnGroup>
);

export default CountryPage;
