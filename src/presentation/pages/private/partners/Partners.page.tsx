import { Toolbar } from "primereact/toolbar";
import { PartnerTable } from "./components/PartnersTable/PartnersTable";
import { Button } from "@/presentation/components";
import { PartnerRegisterEditModal } from "./components/PartnerRegisterEditModal";
import { useState } from "react";

const PartnersPage = () => {
   const [showModel, setShowModal] = useState(false);
  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <Toolbar
        className="mb-6"
        end={
          <Button
            label="Nuevo Partner"
            icon="pi pi-plus"
            onClick={() => setShowModal(true)}
          />
        }
      />
      <PartnerRegisterEditModal
        showModal={showModel}
        setShowModal={setShowModal}
      
      />
      <PartnerTable />
    </div>
  );
};

export default PartnersPage;
