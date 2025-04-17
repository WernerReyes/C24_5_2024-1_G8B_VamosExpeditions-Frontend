import { Button } from "@/presentation/components";
import { NewQuotationDialog } from "../components";
import { QuotesTable } from "./components";

const QuotesPage = () => {
  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
      <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
        <Button
          label="Exportar"
          className="bg-transparent text-black border-[#D0D5DD]"
          icon="pi pi-download"
        />
        <NewQuotationDialog />
      </div>

      <QuotesTable />
    </div>
  );
};

export default QuotesPage;
