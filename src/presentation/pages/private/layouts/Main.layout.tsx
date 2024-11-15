import { classNamesAdapter } from "@/core/adapters";
import React from "react";
import { useWindowSize } from "@/presentation/hooks";
import { Navbar, Sidebar } from "../components";
import { useSidebar } from "../hooks";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { visible, setVisible } = useSidebar();
  const { width, TABLET } = useWindowSize();

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
