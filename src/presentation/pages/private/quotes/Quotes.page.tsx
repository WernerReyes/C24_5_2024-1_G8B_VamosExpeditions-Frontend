import { Button } from "@/presentation/components";
import { MainLayout } from "../layouts";
import { QuotesTable } from "./components";

const QuotesPage = () => {
  return (
    <MainLayout>
      <div className="bg-white p-10 rounded-lg shadow-md">
        <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
          <Button
            label="Exportar"
            className="bg-transparent text-black border-[#D0D5DD]"
            icon="pi pi-download"
          />
          <Button label="Nueva cotización" icon="pi pi-plus-circle" />
        </div>

        <QuotesTable />
      </div>
    </MainLayout>
  );
};

export default QuotesPage;
