import {
  Avatar,
  Badge,
  Dialog,
  Menubar,
  Menu,
  type MenuItem,
} from "@/presentation/components";
import { useState } from "react";

import { classNamesAdapter } from "@/core/adapters";

import "./Navbar.css";

interface NavbarProps {
  setVisible: (value: boolean) => void;
}

export const Navbar = ({ setVisible }: NavbarProps) => {
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const items: MenuItem[] = [
    {
      label: "Perfil",
      icon: "pi pi-user",
      command: () => console.log("Ver perfil"),
    },
    {
      label: "Configuraciones",
      icon: "pi pi-cog",
      command: () => console.log("Abrir configuraciones"),
    },
    {
      label: "Cerrar sesión",
      icon: "pi pi-sign-out",
      command: () => console.log("Cerrar sesión"),
    },
  ];

  return (
    <>
      <Menubar
        menuIcon={null}
        start={() => (
          <i
            className="text-2xl pi pi-bars  cursor-pointer hover:text-primary"
            onClick={() => setVisible(true)}
          />
        )}
        end={() => (
          <div className="flex items-center gap-7  mr-8 ">
            <i
              className="pi pi-bell text-2xl cursor-pointer hover:text-slate-200 p-overlay-badge"
              style={{ fontSize: "2rem" }}
              onClick={() => setShow(true)}
            >
              <Badge value="2" className="bg-red-500"></Badge>
            </i>
            <div className="relative">
              <Avatar
                image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                size="large"
                shape="circle"
                className="cursor-pointer"
                onClick={() => setShowMenu(!showMenu)}
                itemRef="popup_menu_left"
              />
            </div>
          </div>
        )}
        className="fixed-menubar z-[1000]"
      />

      <Menu
        id="popup_menu_left"
        model={items}
        aria-controls="popup_menu_left"
        className={classNamesAdapter(
          !showMenu ? "hidden" : "fixed z-[1000]",
          "right-16 top-[70px]"
        )}
        popupAlignment="left"
      />

      <Dialog
        visible={show}
        header="Notificaciones"
        onHide={() => {
          if (!show) return;
          setShow(false);
        }}
        position="top-right"
        modal={false}
        className="w-96 "
      >
        <hr />
        <p className="mb-5">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat...
        </p>
        <hr />
      </Dialog>
    </>
  );
};
