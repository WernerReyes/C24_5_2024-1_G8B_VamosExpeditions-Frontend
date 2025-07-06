import { Button } from "@/presentation/components";
import { Toolbar } from "primereact/toolbar";
import { ServiceTable } from "./components/ServicesTable/ServiceTable";

import { useState } from "react";
import { ServiceEditAndRegisterModal } from "./components/ServiceRegisterEditModal";


const ServicesPage = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <Toolbar
        className="mb-6"
        end={
          <Button
            label="Nuevo Servicio"
            icon="pi pi-plus"
            onClick={() => setShowModal(true)}
          />
        }
      />
      <ServiceEditAndRegisterModal
        showModal={showModal}
        setShowModal={setShowModal}
      />

      <ServiceTable />
    </div>
  );
};
export default ServicesPage;
