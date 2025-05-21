import { cn } from "@/core/adapters";
import { constantRoutes } from "@/core/constants";
import {
  Link,
  type MenuItem,
  PanelMenu,
  Sidebar as SidebarComponent,
} from "@/presentation/components";
import { useWindowSize } from "@/presentation/hooks";
import { useLocation } from "react-router-dom";
import { NewQuotationDialog } from "../NewQuotationDialog";

import "./Sidebar.css";
import { useSidebar } from "../../hooks";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";

const { DASHBOARD, QUOTES, NEW_QUOTE, RESERVATIONS, HOTEL, COUNTRY, USERS } =
  constantRoutes.private;

const ITEMS: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "pi pi-home",
    url: DASHBOARD,
    template: (e) => <Template menuItem={e} />,
  },
  {
    label: "Reservaciones",
    icon: "pi pi-bookmark",
    url: RESERVATIONS,
    template: (e) => <Template menuItem={e} />,
  },
  {
    id: "quotations",
    label: "Cotizaciones",
    className: "text-xs",
    icon: "pi  pi-book",
    items: [
    
      {
        label: "Nueva Cotización",
        icon: "pi pi-plus-circle",
        template: (e) => <Template menuItem={e} />,
        url: NEW_QUOTE,
      },
      {
        label: "Listado de Cotizaciones",
        icon: "pi pi-book",
        template: (e) => <Template menuItem={e} />,

        url: QUOTES,
      },
    ],
  },
  {
    label: "Hoteles",
    icon: "pi pi-building",
    url: HOTEL,
    template: (e) => <Template menuItem={e} />,
  },
  {
    label: "Países",
    icon: "pi pi-globe",
    url: COUNTRY,
    template: (e) => <Template menuItem={e} />,
  },

  {
    id: "users",
    label: "Usuarios",
    icon: "pi pi-users",
    url: USERS,
    template: (e) => <Template menuItem={e} />,
  },
];

export const Sidebar = () => {
  const { width, DESKTOP, MACBOOK, TABLET } = useWindowSize();
  const { toggleSidebar, visible } = useSidebar();
  const { isManager } = useSelector((state: AppState) => state.auth);

  return (
    <SidebarComponent
      onHide={() => {
        toggleSidebar();
      }}
      header={
        <div  className="flex flex-col items-center justify-center">
          <img src="/images/logo.webp" alt="Logo"  width="200" />
          
          <hr className="mt-3 border-2 w-full border-gray-300 " />
        </div>
      }
      visible={visible}
      className="w-72"
      baseZIndex={width < MACBOOK ? 1000 : 0}
      blockScroll={false}
      modal={width < TABLET}
      dismissable={width < DESKTOP}
    >
      <PanelMenu
        model={ITEMS.map((item) => {
          if (item.id === "users") {
            return {
              ...item,
              visible: isManager,
            };
          }
          return item;
        })}
      />
    </SidebarComponent>
  );
};

const Template = ({ menuItem }: { menuItem: MenuItem }) => {
  const { pathname } = useLocation();

  return (
    <div
      className="p-component p-panelmenu-header
       dark:border-blue-900/40 rounded-md 
       transition-shadow duration-200  dark:hover:bg-gray-800/80"
      aria-label={menuItem.label}
      aria-expanded="false"
      aria-controls="pr_id_52_1_content"
      data-p-highlight="false"
      role="button"
      data-pc-section="header"
    >
      <div
        className={cn("p-panelmenu-header-content", {
          "!bg-primary": menuItem.url === pathname,
        })}
        data-pc-section="headercontent"
      >
        {pathname !== NEW_QUOTE && menuItem.url === NEW_QUOTE ? (
          <NewQuotationDialog>
            <a
              className={cn("p-panelmenu-header-link", {
                "!text-white": menuItem.url === pathname,
              })}
              data-pc-section="headeraction"
            >
              <span
                className={cn("p-menuitem-icon", menuItem.icon)}
                data-pc-section="headericon"
              ></span>
              <span className="p-menuitem-text" data-pc-section="headerlabel">
                {menuItem.label}
              </span>
            </a>
          </NewQuotationDialog>
        ) : (
          <Link
            to={menuItem.url || ""}
            className={cn("p-panelmenu-header-link", {
              "!text-white": menuItem.url === pathname,
            })}
            data-pc-section="headeraction"
          >
            <span
              className={cn("p-menuitem-icon", menuItem.icon)}
              data-pc-section="headericon"
            ></span>
            <span className="p-menuitem-text" data-pc-section="headerlabel">
              {menuItem.label}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
