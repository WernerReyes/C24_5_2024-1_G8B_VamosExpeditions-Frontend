import { Button } from "@/presentation/components";
import { useState } from "react";
import { HotelList } from "./components/HotelList";
import { HotelListDetails } from "./components/HotelListDetails";

export const Accommodiations = () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <div className="flex justify-end">
        <Button
          label="Agregar Hotel"
          icon="pi pi-plus-circle"
          onClick={() => {
            if (visible) return;
            setVisible(true);
          }}
          aria-controls="popup_menu_left"
          aria-haspopup
        />
      </div>

      <HotelListDetails />

      <HotelList visible={visible} setVisible={setVisible} />
    </>
  );
};
