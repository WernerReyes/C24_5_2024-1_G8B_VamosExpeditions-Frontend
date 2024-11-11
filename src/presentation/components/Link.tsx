import { Link as LinkReactRouterDom, LinkProps } from "react-router-dom";

interface Props extends LinkProps {}

export const Link = ({ ...props }: Props) => {
  return <LinkReactRouterDom {...props} />;
};
