import {
  Image,
  Link,
  type MenuItem,
  PanelMenu,
  Sidebar as SidebarComponent,
} from "@/presentation/components";
import { classNamesAdapter } from "@/core/adapters";
import { constantRoutes } from "@/core/constants";
import { useWindowSize } from "@/presentation/hooks";
import "./Sidebar.css";

interface SidebarProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const { DASHBOARD, QUOTES, NEW_QUOTE } = constantRoutes.private;

export const Sidebar = ({ visible, setVisible }: SidebarProps) => {
  const { width, DESKTOP } = useWindowSize();

  const items: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      url: DASHBOARD,
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

      items: [
        {
          label: "Nueva Cotización",
          icon: "pi pi-plus-circle",
          url: NEW_QUOTE,
          template: (e) => <Template {...e} />,
          // url: '/new-quote'
        },
        {
          label: "Listado de Cotizaciones",
          icon: "pi pi-book",
          template: (e) => <Template {...e} />,
          url: QUOTES,
          //url: '/quotes'
        },
      ],
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
        <Image src="/images/logo.png" alt="Logo" width="200" height="200" />
      )}
      onHide={() => setVisible(false)}
      // closeOnEscape={true}
      visible={visible}
      className="w-72"
      blockScroll={false}
      modal={false}
      dismissable={width < DESKTOP}
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
