import {
  Image,
  Link,
  type MenuItem,
  PanelMenu,
  Sidebar as SidebarComponent,
} from "@/presentation/components";

import { classNamesAdapter } from "@/core/adapters";
import { constantRoutes } from "@/core/constants";
import { useAuthStore } from "@/infraestructure/hooks";
import "./Sidebar.css";

interface SidebarProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const {
  common: { DASHBOARD, QUOTES },
} = constantRoutes.private;

export const Sidebar = ({ visible, setVisible }: SidebarProps) => {
  const { authUser } = useAuthStore();

  const dinamyRoute = (route: string) =>
    "/" + (authUser?.role ? authUser?.role + "/" : "manager/") + route;



  const items: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      url: dinamyRoute(DASHBOARD),
      template: (e) => <Template {...e} />,
      // className: "bg-primary p-4",
      // items: [
      //   {
      //     label: "Styled",
      //     icon: "pi pi-eraser",
      //     //url: '/theming'
      //   },
      //   {
      //     label: "Unstyled",
      //     icon: "pi pi-heart",
      //     //url: '/unstyled'
      //   },
      // ],
    },
    {
      label: "Cotizaciones",
      icon: "pi  pi-book",
      url: dinamyRoute(QUOTES),
      template: (e) => <Template {...e} />,
    },

    // {
    //   label: "Usuarios",
    //   icon: "pi pi-users",
    //   items: [
    //     {
    //       label: "React.js",
    //       icon: "pi pi-star",
    //       // url: 'https://react.dev/'
    //     },
    //     {
    //       label: "Vite.js",
    //       icon: "pi pi-bookmark",
    //       //url: 'https://vite.dev/'
    //     },
    //   ],
    // },
  ];

  return (
    <SidebarComponent
      header={() => (
        <Image src="/images/logo.png" alt="Logo" width="150" height="200" />
      )}
      onHide={() => setVisible(false)}
      visible={visible}
      position="left"
      className="w-72"
      showCloseIcon={true}
      blockScroll={false}
      modal={false}
      dismissable={window.innerWidth < 1000}
    >
      <hr className="mt-3 mb-2 border-2 border-gray-300 " />
      <PanelMenu model={items} className="w-full" />
    </SidebarComponent>
  );
};

const Template = (e: MenuItem) => (
  <div
    className="p-component p-panelmenu-header dark:border-blue-900/40 text-red-400 dark:text-red-100  rounded-md transition-shadow duration-200  dark:hover:bg-gray-800/80  hover:text-red-400 ark:hover:text-red-400"
    aria-label={e.label}
    aria-expanded="false"
    aria-controls="pr_id_52_1_content"
    data-p-highlight="false"
    role="button"
    data-pc-section="header"
  >
    <div
      className={classNamesAdapter("p-panelmenu-header-content", {
        "!bg-primary": e.url === window.location.pathname,
      })}
      data-pc-section="headercontent"
    >
      <Link
        to={e.url || ""}
        className={classNamesAdapter("p-panelmenu-header-link", {
          "!text-white": e.url === window.location.pathname,
        })}
        data-pc-section="headeraction"
      >
        <span
          className={classNamesAdapter("p-menuitem-icon", e.icon)}
          data-pc-section="headericon"
        ></span>
        <span className="p-menuitem-text" data-pc-section="headerlabel">
          {e.label}
        </span>
      </Link>
    </div>
  </div>
);
