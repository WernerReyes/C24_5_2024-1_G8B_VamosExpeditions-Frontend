import { useEffect, memo } from "react";
import { ClientForm, ReservationForm } from "./components";

export const CustomerDataModule = memo(() => {
  useEffect(() => {
    console.log("CustomerDataModule");
  }, []);

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <ClientForm  />

      <ReservationForm />
    </div>
  );
});
