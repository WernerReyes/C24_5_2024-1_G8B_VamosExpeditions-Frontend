import { Button } from "@/presentation/components";
import { MainLayout } from "../layouts";
import { ReservationTable } from "./components";

const ReservationsPage = () => {
  return (
    <MainLayout>
      <div className="bg-white p-10 rounded-lg shadow-md">
        {/* <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
          <Button
            label="Exportar"
            className="bg-transparent text-black border-[#D0D5DD]"
            icon="pi pi-download"
          />
          <Button label="Importar" icon="pi pi-file-import" />
        </div> */}

        <ReservationTable />
      </div>
    </MainLayout>
  );
};

export default ReservationsPage;
