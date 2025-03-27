import { type CardProps, Card as CardPrimeReact } from "primereact/card";

interface Props extends CardProps {}
export const Card = ({ ...props }: Props) => {
  return <CardPrimeReact {...props} pt={{
    root: {
      className: "p-card p-card-rounded p-card-shadow p-card-border",
    }
  }} />;
};
