import { useEffect, memo } from "react";
import { ClientForm, ReservationForm } from "./components";

export const CustomerDataModule = memo(() => {
  useEffect(() => {
    console.log("CustomerDataModule");
  }, []);

  return (
    <div
      className="
      grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4
    "
    >
      <ClientForm />
      <div className="lg:col-span-2">
        <ReservationForm />
      </div>
    </div>
  );
});
