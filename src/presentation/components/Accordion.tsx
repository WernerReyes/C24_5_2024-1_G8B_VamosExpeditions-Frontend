import {
  Accordion as AccordionPrimeReact,
  type AccordionProps as AccordionPropsPrimeReact,
  type AccordionTabChangeEvent
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
          <AccordionTabPrimeReact {...tab} key={index}  />
        ))}
    </AccordionPrimeReact>
  );
};

export type { AccordionTabChangeEvent };
