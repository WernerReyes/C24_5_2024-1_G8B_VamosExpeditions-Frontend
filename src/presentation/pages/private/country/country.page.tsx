import {
  /* Button,
  Dialog,
  Dropdown,
  InputText, */
  TabView,
} from "@/presentation/components";
import { DataViewDistrit } from "./distrit/DataViewDistrit";
/* import { useState } from "react"; */

const CountryPage = () => {
  /* const [visible, setVisible] = useState(false); */

  const pais = <i className="pi pi-building"></i>;

  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      {/* <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
         <Button
          label="Nuevo"
          icon="pi pi-plus"
          onClick={() => setVisible(true)}
        /> 



      </div> */}

      <TabView
        className="my-0 mx-0"
        tabPanelContent={[
          {
            header: (
            
                <div className="flex justify-center items-center gap-2 ">
                <i className="pi pi-globe" 
                 style={{ fontSize: "2rem" }}
                />
                <h2 className="">Pais</h2>
               </div>
              
            ),
            className: "w-full h-full",
            children: (
              <>
                <h1>Pais</h1>
              </>
            ),
          },
          {
            header: (
              
                <div className="flex justify-center items-center gap-2">
                <i className="pi pi-map-marker"
                style={{ fontSize: "2rem" }}
                />
                <h2>Ciudades</h2>
                </div>
              
            ),
            className: "w-full h-full",
            children: (
              <>
                <h1>Ciudades</h1>
              </>
            ),
          },
          {
            header: (
              
                <div className="flex justify-center items-center gap-2 ">
                <i className="pi pi-map"
                style={{ fontSize: "2rem" }}
                />
                <h2>Distritos</h2>
                </div>
              
            ),
            className: "w-full h-full",
            children: (
              <>
                <DataViewDistrit/>
              </>
            ),
          },
        ]}
      />
    </div>
  );
};
export default CountryPage;

{
  /* <Dialog
          header="Nuevo Pais"
          visible={visible}
          onHide={() => setVisible(false)}
          breakpoints={{ "960px": "75vw", "641px": "100vw" }}
          style={{ height: "auto" }}
        >
          <form>
            <div
              className="
                           grid grid-cols-1 md:grid-cols-2 gap-4
                            mb-4
                bg-gradient-to-r from-blue-100 to-transparent p-4 rounded-lg
                           "
            >
              <div >
                <InputText
                  label={{ text: "Nombre del pais" }}
                  placeholder="Nombre del pais"
                  className="w-full"
                />
              </div>
              <div>
                <InputText
                  label={{ text: "Codigo del pais" }}
                  placeholder="Codigo del pais"
                  className="w-full"
                />
              </div>
            </div>
            
            <div
              className="
               grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 mb-4
                bg-gradient-to-r from-purple-100 to-transparent p-4 rounded-lg
            "
            >
              <div >
                <Dropdown
                  label={{ text: "Categoria" }}
                  placeholder="Nombre del hotel"
                  className="w-full"
                  filter
                  options={[
                    { label: "Categoria 1", value: "1" },
                    { label: "Categoria 2", value: "2" },
                    { label: "Categoria 3", value: "3" },
                  ]}
                />
              </div>
              <div>
                <InputText
                  label={{ text: "Nombre del Hotel" }}
                  placeholder="Nombre del hotel"
                  className="w-full"
                />
              </div>
            </div>

            <div
              className="
              grid grid-cols-1 md:grid-cols-2 gap-4
              mt-4 mb-4  bg-gradient-to-r from-teal-100 to-transparent p-4 rounded-lg
              "
            >
              <div >
                <Dropdown
                  label={{ text: "Categoria" }}
                  placeholder="Nombre del hotel"
                  className="w-full"
                  filter
                  options={[
                    { label: "Categoria 1", value: "1" },
                    { label: "Categoria 2", value: "2" },
                    { label: "Categoria 3", value: "3" },
                  ]}
                />
              </div>
              <div>
                <InputText
                  label={{ text: "Nombre del Hotel" }}
                  placeholder="Nombre del hotel"
                  className="w-full"
                />
              </div>
            </div>
          </form>
        </Dialog> */
}
