import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, Menu, type MenuItem } from "@/presentation/components";
import { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { useLogoutMutation } from "@/infraestructure/store/services";
import { useClickOutside } from "primereact/hooks";
import { useRef, useState } from "react";
import { cn } from "@/core/adapters";
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
] as const;

export const Settings = () => {
  const navigate = useNavigate();

  const { authUser } = useSelector((state: AppState) => state.auth);
  const [logout] = useLogoutMutation();

  const [show, setShow] = useState(false);

  const ref = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null); // Referencia para el icono de la campana

  useClickOutside(ref, (event: MouseEvent) => {
    if (
      iconRef.current &&
      !(event.target instanceof Node && iconRef.current.contains(event.target))
    ) {
      setShow(false);
    }
  });

  return (
    <div className="relative">
      <div ref={iconRef} className="flex gap-x-2 items-center">
        <Avatar
          shape="circle"
          badge={{
            severity: authUser?.online ? "success" : "danger",
          }}
          label={authUser?.fullname}
          className=" bg-tertiary"
          onClick={() => setShow(!show)}
        />
        <span className="text-white">{authUser?.fullname}</span>
        <i
          className="pi pi-angle-down text-white cursor-pointer hover:text-slate-200"
          onClick={() => setShow(!show)}
        />
      </div>

      <div
        ref={ref}
        className={cn(
          "fixed z-[1000] right-1 top-[60px]",
          show ? "animation-enter" : "animation-leave"
        )}
      >
        <Menu
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
          popupAlignment="left"
        />
      </div>
    </div>
  );
};
