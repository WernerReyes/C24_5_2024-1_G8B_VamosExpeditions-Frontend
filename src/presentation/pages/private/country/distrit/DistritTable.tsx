import { CityEntity } from "@/domain/entities";
import { Badge, Column, DataTable } from "@/presentation/components";
import { TableDistritActions } from "./TableDistritActions";
/* import { useState } from "react"; */

type Props = {
  rowData: CityEntity;
  country: {
    id: number;
    name: string;
  }
};

export const DistritTable = ({ rowData,country }: Props) => {
    
  return (
    <div className="p-6 bg-gradient-to-r from-slate-50 to-white border-t border-slate-100">
      <div className="flex items-center mb-4">
        <i className="pi pi-map-marker text-sm bg-gradient-to-r from-amber-400 to-orange-400 p-2 text-white rounded-full mr-3" />

        <Badge
          className="text-white"
          severity={"warning"}
          size={"normal"}
          value={`Distritos de ${rowData.name}`}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
        <DataTable
          value={rowData.distrits}
          className="md:text-sm"
          emptyMessage="No hay distritos registrados"
          size="small"
          filterDisplay="menu"
          pt={{
            wrapper: {
              className: "rounded-xl",
            },
          }}
        >
          <Column
            field="name"
            header="Nombre"
            headerClassName="font-semibold text-slate-700"
            style={{ width: "40%" }}
            body={(rowData) => {
              return (
                <div className="flex gap-3 items-center">
                  <i className="pi pi-map-marker text-sm bg-gradient-to-r from-amber-400 to-orange-400 p-2 text-white rounded-full" />

                  <div>
                    <span className="font-medium text-slate-700">
                      {rowData.name}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">
                      Código: {rowData.code || "N/A"}
                    </div>
                  </div>
                </div>
              );
            }}
          />
          <Column
            header="Tipo"
            /* headerClassName="font-semibold text-slate-700" */
            style={{ width: "30%" }}
            field="code"
            body={(rowData) => (
              <Badge
                className=" text-white"
                severity={"warning"}
                size={"normal"}
                value={rowData.code || "Distrito"}
              />
            )}
          />
          <Column
            header="Acciones"
            headerClassName="font-semibold text-slate-700 text-right"
            style={{ width: "30%" }}
            body={(data: CityEntity) => (
              <TableDistritActions
                rowData={{
                  id: rowData.id,
                  name: rowData.name,
                  distrits: [
                    {
                      id: data.id,
                      name: data.name,
                    },
                  ],
                }}
                county={{
                  id: country.id,
                  name: country.name,
                }}
              />
            )}
          />
        </DataTable>
      </div>
    </div>
  );
};
