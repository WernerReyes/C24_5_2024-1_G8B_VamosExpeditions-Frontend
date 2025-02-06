import { Slider as PrimeSlider, type SliderProps } from "primereact/slider";

interface Props extends SliderProps {}

export const Slider = ({ ...props }: Props) => {
  return <PrimeSlider {...props} />;
};
