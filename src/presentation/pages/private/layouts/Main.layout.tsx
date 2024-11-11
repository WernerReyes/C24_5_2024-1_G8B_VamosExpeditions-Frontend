import React from "react";
import { useSidebar } from "../hooks";
import { Navbar, Sidebar } from "../components";
import { classNamesAdapter } from "@/core/adapters";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { visible, setVisible } = useSidebar();
  return (
    <section className="w-screen min-h-screen flex max-w-full">
      <div
        className={classNamesAdapter(
          "w-72",
          visible ? "sidebar-fixed" : "hidden"
        )}
      >
        <Sidebar visible={visible} setVisible={setVisible} />
      </div>

      <div className={`flex-1 bg-secondary ${visible ? "" : "w-full"} `}>
        <Navbar setVisible={setVisible} />

        <main className="px-5 pt-28 pb-10 md:px-10 xl:px-20">{children}</main>
      </div>
    </section>
  );
};
