import { Button } from "@/presentation/components";
import { useState } from "react";
import { ServiceList } from "./components/ServiceList";
import { ServiceListDetails } from "./components/ServiceListDetails";

export const Services = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-end">
        <Button
          label="Agregar Servicio"
          icon="pi pi-plus-circle"
          aria-controls="popup_menu_left"
          onClick={() => {
            if (visible) return;
            setVisible(true);
          }}
          aria-haspopup
        />
      </div>
      {/* <p className="text-center bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
        Ningún servicio por ahora
      </p> */}

      <ServiceListDetails />

      <ServiceList visible={visible} setVisible={setVisible} />
    </>
  );
};
