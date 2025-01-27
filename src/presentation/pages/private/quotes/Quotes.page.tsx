import { Button } from "@/presentation/components";
import { QuotesTable } from "./components";
import { NewQuotationButton } from "../components";

const QuotesPage = () => {
  return (
    // <MainLayout>
      <div className="bg-white p-10 rounded-lg shadow-md">
        <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
          <Button
            label="Exportar"
            className="bg-transparent text-black border-[#D0D5DD]"
            icon="pi pi-download"
          />
          <NewQuotationButton />
        </div>

        <QuotesTable />
      </div>
  
  );
};

export default QuotesPage;
