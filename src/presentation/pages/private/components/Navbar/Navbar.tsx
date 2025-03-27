import {
  Avatar,
  Badge,
  Dialog,
  Menubar,
  Menu,
  type MenuItem,
} from "@/presentation/components";
import { useState } from "react";

import { cn } from "@/core/adapters";

import "./Navbar.css";
import { useSidebar } from "../../hooks";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { useNavigate } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
import { useLogoutMutation } from "@/infraestructure/store/services";

const { PROFILE } = constantRoutes.private;

const ITEMS: MenuItem[] = [
  {
    id: "profile",
    label: "Perfil",
    icon: "pi pi-user",
  },
  {
    id: "logout",
    label: "Cerrar sesión",
    icon: "pi pi-sign-out",
  },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector((state: AppState) => state.auth);
  const [logout] = useLogoutMutation();
  const { toggleSidebar } = useSidebar();
  const [show, setShow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      <Menubar
        menuIcon={null}
        start={() => (
          <i
            className="text-2xl pi pi-bars cursor-pointer"
            onClick={() => {
              toggleSidebar();
            }}
          />
        )}
        end={() => (
          <div className="flex items-center gap-7  mr-8 ">
            <i
              className="pi pi-bell text-2xl cursor-pointer hover:text-slate-200 p-overlay-badge"
              onClick={() => setShow(true)}
            >
              <Badge value="2" className="bg-red-500"></Badge>
            </i>

            <div className="flex gap-x-2 items-center">
              <Avatar
                shape="circle"
                label={authUser?.fullname}
                className=" bg-tertiary"
                onClick={() => setShowMenu(!showMenu)}
              />
              <span className="text-white">{authUser?.fullname}</span>
              <i
                className="pi pi-angle-down text-white cursor-pointer hover:text-slate-200"
                onClick={() => setShowMenu(!showMenu)}
              />
            </div>
          </div>
        )}
        className="fixed-menubar z-[1000]"
      />

      <Menu
        id="popup_menu_left"
        model={ITEMS.map((item) => ({
          ...item,
          command: () => {
            if (item.id === "profile") {
              navigate(PROFILE);
            }

            if (item.id === "logout") {
              logout();
            }
          },
        }))}
        aria-controls="popup_menu_left"
        className={cn(
          !showMenu ? "hidden" : "fixed z-[1000]",
          "right-12 top-[60px]"
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
