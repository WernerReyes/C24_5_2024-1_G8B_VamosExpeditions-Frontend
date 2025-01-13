import { Button } from "@/presentation/components";
import { useState } from "react";
import { HotelList } from "./components/HotelList";
import { AccommodiationsListDetails } from "./components/AccommodiationsListDetails";
import type { Day } from "../Itineraty";

type Props = {
  selectedDay: Day;
};

export const Accommodiations = ({ selectedDay }: Props) => {
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

      <AccommodiationsListDetails selectedDay={selectedDay} />

      <HotelList
        visible={visible}
        setVisible={setVisible}
        selectedDay={selectedDay}
      />
    </>
  );
};
