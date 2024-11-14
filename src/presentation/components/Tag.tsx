import { Tag as TagPrimeReact, type TagProps } from "primereact/tag";

interface Props extends TagProps {}

export const Tag = (props: Props) => {
  return <TagPrimeReact {...props} />;
};
