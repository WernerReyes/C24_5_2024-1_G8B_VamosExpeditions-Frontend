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
  tabContent?: AccordionTabProps[];
}

export const Accordion = ({
  tabContent = [],
  ...rest
}: AccordionProps) => {
  return (
    <AccordionPrimeReact {...rest}>
      {tabContent.length > 0 &&
        tabContent.map((tab, index) => (
          <AccordionTabPrimeReact {...tab} key={index} pt={{
            headerTitle: {
              className: "max-sm:text-sm",
            }
          }}  />
        ))}
    </AccordionPrimeReact>
  );
};

export type { AccordionTabChangeEvent };
