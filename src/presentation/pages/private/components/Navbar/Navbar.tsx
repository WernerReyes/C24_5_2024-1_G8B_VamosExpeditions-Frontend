import { Menubar } from "@/presentation/components";
import { Notifications, Settings } from "./components";
import { useSidebar } from "../../hooks";

import "./Navbar.css";

export const Navbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <Menubar
      menuIcon={null}
      start={() => (
        <i
          className="text-2xl pi pi-bars cursor-pointer"
          onClick={toggleSidebar}
        />
      )}
      end={() => (
        <div className="flex items-center gap-7">
          <Notifications />

          <Settings />
        </div>
      )}
      className="fixed-menubar z-[1000]"
    />
  );
};
