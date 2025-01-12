import {
  Accordion as AccordionPrimeReact,
  type AccordionProps as AccordionPropsPrimeReact,
} from "primereact/accordion";

import {
  AccordionTab as AccordionTabPrimeReact,
  type AccordionTabProps as AccordionTabPropsPrimeReact,
} from "primereact/accordion";

interface AccordionTabProps extends AccordionTabPropsPrimeReact {
  children: React.ReactNode;
}

interface AccordionProps extends AccordionPropsPrimeReact {
  includeTab?: boolean;
  tabContent?: AccordionTabProps[];
}

export const Accordion = ({
  includeTab,
  tabContent = [],
  ...rest
}: AccordionProps) => {
  return (
    <AccordionPrimeReact {...rest}>
      {includeTab &&
        tabContent.map((tab, index) => (
          <AccordionTabPrimeReact key={index} {...tab} />
        ))}
    </AccordionPrimeReact>
  );
};
