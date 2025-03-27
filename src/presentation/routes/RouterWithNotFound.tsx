import { Route, Routes } from "react-router-dom";
import { NotFound } from "../components";

interface Props {
  children: JSX.Element[] | JSX.Element;
  type?: "private" | "public";
}
export const RouterWithNotFound = ({ children, type = "public" }: Props) => {
  return (
    <Routes>
      {children}
      <Route
        path="*"
        element={
          <NotFound screenSize={type === "private" ? "partial" : "full"} />
        }
      />
    </Routes>
  );
};
