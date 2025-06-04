import { Button, Toolbar } from "@/presentation/components";
import { ClientRegisterEditModal, ClientTable } from "./components";
import { useState } from "react";


const ClientsPage = () => {
  const [showModel, setShowModal] = useState(false);
  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <Toolbar
        className="mb-6"
        end={
          <Button
            label="Nuevo Cliente"
            icon="pi pi-plus"
            onClick={() => setShowModal(true)}
          />
        }
      />
      <ClientRegisterEditModal
              showModal={showModel}
              setShowModal={setShowModal}
              
            
            />
      <ClientTable />
    </div>
  );
};

export default ClientsPage;
