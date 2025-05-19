import {
  Divider
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { ClientForm, TripDetailsForm } from "./components";

export const CustomerDataModule = () => {
  const { width, DESKTOP } = useWindowSize();

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <div className="flex-1">
        <div className="flex items-center mb-2 gap-x-2 text-lg">
          <i className="pi pi-user text-primary text-xl"></i>
          <h5 className="font-bold ">Datos del cliente</h5>
        </div>
        <ClientForm />
      </div>
      <Divider
        className="my-4"
        layout={width >= DESKTOP + 238 ? "vertical" : "horizontal"}
      />
      {/* <ClientForm /> */}
      <div className="flex-[2]">
        <div className="flex items-center mb-2 gap-x-2 text-lg">
          <i className="pi pi-calendar text-primary text-xl"></i>
          <h5 className="font-bold ">Detalles del viaje</h5>
        </div>
        <TripDetailsForm />
      </div>
    </div>
  );
};
