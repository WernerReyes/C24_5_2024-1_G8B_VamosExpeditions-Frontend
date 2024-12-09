import { Rating as RatingPrimeReact, RatingProps } from "primereact/rating";

interface Props extends RatingProps {}

export const Rating = (props: Props) => {
  return <RatingPrimeReact {...props} />;
};
