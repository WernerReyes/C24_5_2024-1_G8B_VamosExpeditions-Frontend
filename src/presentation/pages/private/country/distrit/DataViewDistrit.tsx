import { DistritEntity } from "@/domain/entities";
import { useGetDistritsAndCityQuery } from "@/infraestructure/store/services";
import { Button, Checkbox, Divider } from "@/presentation/components";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";
import { Rating } from "primereact/rating";
import { classNames } from "primereact/utils";
import { useState } from "react";

export const DataViewDistrit = () => {
  const { data, isLoading } = useGetDistritsAndCityQuery();
  /* const [layout, setLayout] = useState<"grid" | "list">("grid"); */
  /* const [check, setCheck] = useState(false); */

  const [selectedDistrits, setSelectedDistrits] = useState<number[]>([]);

  const toggleCheckbox = (id: number) => {
    setSelectedDistrits((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };
  console.log("selectedDistrits", selectedDistrits);

  const gridItem = (distrit: DistritEntity) => {
    return (
      <div className="" key={distrit.id}>
        <div className="border border-gray-300 bg-white rounded-lg shadow-md">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3 text-primary font-bold">
              <div className="flex items-center">
                <Checkbox
                  inputId={`check-${distrit.id}`}
                  name="checkHotel"
                  value={distrit.id}
                  onChange={() => toggleCheckbox(distrit.id)}
                  checked={selectedDistrits.includes(distrit.id)}
                  className="mr-2"
                />

                <i className="pi pi-map"></i>
                <h3 className="ml-2 text-lg ">{distrit.name}</h3>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Código:</span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {distrit.id}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Ciudad:</span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {distrit.city?.name}
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-3 border-t border-gray-100">
              <Button
                icon="pi pi-eye text-xl"
                rounded
                text
                onClick={() => console.log("Ver detalles")}
              />
              <Button
                icon="pi pi-pen-to-square text-xl"
                rounded
                text
                onClick={() => console.log("Editar")}
              />

              <Button
                icon="pi pi-trash text-xl"
                rounded
                text
                severity="danger"
                onClick={() => console.log("Eliminar")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* const header = () => {
    return (
      <div className="flex justify-start ">
        <DataViewLayoutOptions
          layout={layout}
          onChange={(e) => setLayout(e.value as "grid" | "list")}
        />
      </div>
    );
  }; */

  return (
    
      <DataView
        value={data?.data}
        layout="grid"
        listTemplate={() => (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {data?.data?.map((distrit) => gridItem(distrit))}
          </div>
        )}
        /* layout={layout} */
        /* header={
            <div className="flex justify-start ">
                <DataViewLayoutOptions
                layout={layout}
                onChange={(e) => setLayout(e.value as "grid" | "list")}
                />
            </div>
         */

        /* paginator
        paginatorClassName=""
        paginatorPosition="both"
        paginatorTemplate={
          "FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
        }
        rowsPerPageOptions={[5, 10, 15]}
        rows={5} */
      />
    
  );
};
