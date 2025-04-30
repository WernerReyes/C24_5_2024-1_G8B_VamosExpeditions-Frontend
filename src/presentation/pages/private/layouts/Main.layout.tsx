import type { AppState } from "@/app/store";
import { cn } from "@/core/adapters";
import { quotationService } from "@/data";
import { onSetCurrentQuotation } from "@/infraestructure/store";
import { useWindowSize } from "@/presentation/hooks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navbar, OfflineDialog, Sidebar } from "../components";
import { useSidebar } from "../hooks";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const dispatch = useDispatch();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const { width, TABLET } = useWindowSize();
  const { visible } = useSidebar();

  useEffect(() => {
    if (currentQuotation) return;
    quotationService
      .getCurrentQuotation()
      .then((quotation) => dispatch(onSetCurrentQuotation(quotation) ?? null));
  }, [currentQuotation]);

  return (
    <section className="w-screen min-h-screen flex max-w-full">
      <div className={cn(visible ? "sidebar-fixed" : "hidden")}>
        <Sidebar />
      </div>

      <div
        style={{
          width: visible && width > TABLET ? "calc(100% - 18rem)" : "100%",
          transition: "width 0.5s",
        }}
        className="ml-auto"
      >
        <Navbar />
        
        //* Show dialog when the connection is off
        {/* <OfflineDialog /> */}

        <main className="px-5 pt-28 bg-secondary pb-10 md:px-10 h-full xl:px-20">
          {children}
        </main>
      </div>
    </section>
  );
};

export default MainLayout;
