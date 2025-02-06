import { useEffect } from "react";
import { classNamesAdapter } from "@/core/adapters";
import { useWindowSize } from "@/presentation/hooks";
import { Navbar, Sidebar } from "../components";
import { useSidebar } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { quotationService } from "@/data";
import { onSetCurrentQuotation } from "@/infraestructure/store";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const dispatch = useDispatch();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const { width, TABLET } = useWindowSize();
  const { visible, setVisible } = useSidebar();
 

  useEffect(() => {
    if (currentQuotation) return;
    quotationService
      .getCurrentQuotation()
      .then((quotation) => dispatch(onSetCurrentQuotation(quotation) ?? null));
  }, [currentQuotation]);

  return (
    <section className="w-screen min-h-screen flex max-w-full">
      <div
        className={classNamesAdapter(
          "bg-red-400 transition-all",
          visible ? "sidebar-fixed bg-red-500" : "hidden"
        )}
      >
        <Sidebar visible={visible} setVisible={setVisible} />
      </div>

      <div
        style={{
          width: visible && width > TABLET ? "calc(100% - 18rem)" : "100%",
          transition: "width 0.5s",
        }}
        className="ml-auto bg-secondary transition-all"
      >
        <Navbar setVisible={setVisible} />

        <main className="px-5 pt-28 pb-10 md:px-10 xl:px-20">{children}</main>
      </div>
    </section>
  );
};

export default MainLayout;
