import {
  OrderList as OrderListPrimeReact,
  type OrderListProps,
} from "primereact/orderlist";

interface Props extends OrderListProps {}

export const OrderList = ({ ...orderListProps }: Props) => {
  return <OrderListPrimeReact {...orderListProps} />;
};
