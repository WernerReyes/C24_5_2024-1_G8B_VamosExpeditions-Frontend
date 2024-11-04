import { type ImageProps, Image as ImagePrimeReact } from "primereact/image";

interface Props extends ImageProps {}

export const Image = ({ ...props }: Props) => {
  return <ImagePrimeReact {...props} />;
};
