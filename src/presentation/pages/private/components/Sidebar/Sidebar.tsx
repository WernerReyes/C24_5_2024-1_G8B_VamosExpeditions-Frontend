import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { confirmReplaceQuotation } from "../NewQuotationButton";
import {
  onSetCurrentQuotation,
  onSetCurrentStep,
} from "@/infraestructure/store";
import { quotationService } from "@/data";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "@/app/store";
import { useCreateQuotationMutation } from "@/infraestructure/store/services";

import "./Sidebar.css";
interface SidebarProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const { DASHBOARD, QUOTES, NEW_QUOTE, RESERVATIONS } = constantRoutes.private;

export const Sidebar = ({ visible, setVisible }: SidebarProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { width, DESKTOP, MACBOOK } = useWindowSize();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const [createQuotation] = useCreateQuotationMutation();

  const handleNewQuote = async () => {
    if (currentQuotation) {
      const confirm = await confirmReplaceQuotation();
      if (confirm) {
        await quotationService.deleteCurrentQuotation();
        dispatch(onSetCurrentQuotation(null));
        dispatch(onSetCurrentStep(0));
        await createQuotation();
      }
    } else {
      await createQuotation();
    }
    navigate(NEW_QUOTE);
  };

  useEffect(() => {
    if (currentQuotation) return;
    quotationService
      .getCurrentQuotation()
      .then((quotation) => dispatch(onSetCurrentQuotation(quotation) ?? null));
  }, [currentQuotation]);

  const items: MenuItem[] = [
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
      label: "Cotizaciones",
      icon: "pi  pi-book",

      items: [
        {
          label: "Nueva Cotización",
          icon: "pi pi-plus-circle",
          template: (e) => <Template menuItem={e} />,
          command: () => {
            if (pathname === NEW_QUOTE) return;
            handleNewQuote();
          },
        },
        {
          label: "Listado de Cotizaciones",
          icon: "pi pi-book",
          template: (e) => <Template menuItem={e} />,

          url: QUOTES,
        },
      ],
    },
  ];

  return (
    <SidebarComponent
      header={
        <Image src="/images/logo.png" alt="Logo" width="200" height="200" />
      }
      onHide={() => setVisible(false)}
      visible={visible}
      className="w-72"
      baseZIndex={width < MACBOOK ? 1000 : 0}
      blockScroll={false}
      modal={width < MACBOOK}
      dismissable={width < DESKTOP}
    >
      <hr className="mt-3 mb-2 border-2 border-gray-300 " />
      <PanelMenu model={items} className="w-full" />
    </SidebarComponent>
  );
};

const Template = ({ menuItem }: { menuItem: MenuItem }) => {
  const { pathname } = useLocation();
  return (
    <div
      className="p-component p-panelmenu-header dark:border-blue-900/40 text-red-400 dark:text-red-100  rounded-md transition-shadow duration-200  dark:hover:bg-gray-800/80  hover:text-red-400 ark:hover:text-red-400"
      aria-label={menuItem.label}
      aria-expanded="false"
      aria-controls="pr_id_52_1_content"
      data-p-highlight="false"
      role="button"
      data-pc-section="header"
    >
      <div
        className={classNamesAdapter("p-panelmenu-header-content", {
          "!bg-primary": menuItem.url === pathname,
        })}
        data-pc-section="headercontent"
      >
        <Link
          to={menuItem.url || ""}
          className={classNamesAdapter("p-panelmenu-header-link", {
            "!text-white": menuItem.url === pathname,
          })}
          data-pc-section="headeraction"
        >
          <span
            className={classNamesAdapter("p-menuitem-icon", menuItem.icon)}
            data-pc-section="headericon"
          ></span>
          <span className="p-menuitem-text" data-pc-section="headerlabel">
            {menuItem.label}
          </span>
        </Link>
      </div>
    </div>
  );
};
