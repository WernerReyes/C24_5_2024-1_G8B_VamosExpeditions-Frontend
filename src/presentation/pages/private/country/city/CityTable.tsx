import { CityEntity, CountryEntity } from "@/domain/entities";
import {
  Column,
  DataTable,
  DataTableExpandedRows,
  DataTableValueArray,
} from "@/presentation/components";
import { Badge } from "primereact/badge";
import { useState } from "react";
import { DistritTable } from "../distrit/DistritTable";

import { TableCityActions } from "./TableCityActions";




type Props = {
  rowData: CountryEntity;
};

export const CountryTable = ({ rowData }: Props) => {
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);
  
  // start state for modal

  // end  state for modal
  return (
    <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
      <div className="flex items-center mb-4">
        <i className="pi pi-map text-lg bg-gradient-to-r from-sky-500 to-sky-500 text-white rounded-full p-2 mr-3" />

        <Badge
          className="text-white"
          severity={"info"}
          size={"normal"}
          value={`Ciudades de ${rowData.name}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <DataTable
          value={rowData.cities}
          className="md:text-sm"
          emptyMessage="No hay ciudades registradas"
          size="small"
          filterDisplay="menu"
          pt={{
            wrapper: {
              className: "rounded-xl",
            },
          }}
          onRowToggle={(e) => setExpandedRows(e.data)}
          expandedRows={expandedRows}
          rowExpansionTemplate={(data: CityEntity) => {
            return (
              <DistritTable
                rowData={data}
                country={{
                  id: rowData.id,
                  name: rowData.name,
                } as CountryEntity}
              />
            );
          }}
        >
          <Column expander style={{ width: "3rem", background: "white" }} />
          <Column
            field="name"
            header="Nombre"
            headerClassName="font-semibold text-slate-700"
            style={{ width: "40%" }}
            body={(rowData) => {
              return (
                <div className="flex gap-3 items-center">
                  <i
                    className="pi 
                    pi-map text-sm
                    bg-gradient-to-r 
                  from-sky-500 to-sky-500 text-white rounded-full p-2 
                    "
                  />

                  <div>
                    <span className="font-medium text-slate-700">
                      {rowData.name}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      {rowData.distrits?.length || 0} distritos
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            header="Tipo"
            style={{ width: "30%" }}
            field="code"
            body={(rowData) => (
              <Badge
                className="text-white"
                severity={"info"}
                size={"normal"}
                value={rowData.code || "Ciudad"}
              />
            )}
          />
          <Column
            header="Acciones"
            style={{ width: "30%" }}
            body={(data: CityEntity) => (
              <TableCityActions
                rowData={{
                  id: rowData.id,
                  name: rowData.name,
                  code: rowData.code,
                  cities: [
                    {
                      id: data.id,
                      name: data.name,
                    },
                  ] as CityEntity[],
                }}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};
