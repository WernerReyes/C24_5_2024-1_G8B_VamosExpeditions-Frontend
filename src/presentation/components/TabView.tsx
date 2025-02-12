import {
  TabPanel as TabPanelPrimeReact,
  type TabPanelProps as TabPanelPropsPrimeReact,
  TabView as TabViewPrimeReact,
  type TabViewProps,
} from "primereact/tabview";
import { classNames } from "primereact/utils";
import { useWindowSize } from "../hooks";
import { classNamesAdapter } from "@/core/adapters";

interface Props extends TabViewProps {
  tabPanelContent: TabPanelProps[];
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
}

interface TabPanelProps extends TabPanelPropsPrimeReact {}

export const TabView = ({
  tabPanelContent,
  loading,
  loadingTemplate,
  ...props
}: Props) => {
  const { width, TABLET } = useWindowSize();
  return (
    <TabViewPrimeReact
      {...props}
      pt={{
        ...Tailwind,
        panelContainer: {
          className: classNamesAdapter("h-full", width < TABLET && "p-0"),
        },
        nav: {
          className:
            "flex justify-evenly list-none thin-scrollbar overflow-x-auto overflow-y-hidden border border-gray-300  border-0 border-b-2",
        },
        inkbar: {
          className: "border-transparent p-0 border-none hidden",
        },
        ...props.pt,
      }}
    >
      {tabPanelContent.map((tabPanel, index) => (
        <TabPanelPrimeReact
          key={index}
          {...tabPanel}
          pt={{
            root: {
              className: "h-full",
            },

            ...tabPanel.pt,
          }}
          children={loading ? loadingTemplate : tabPanel.children}
        />
      ))}
    </TabViewPrimeReact>
  );
};

export const TabPanel = ({ children, ...props }: TabPanelProps) => {
  return <TabPanelPrimeReact {...props}>{children}</TabPanelPrimeReact>;
};

const Tailwind = {
  tabview: {
    navContainer: ({ props }: any) => ({
      className: classNames(
        "relative", // Relative positioning.
        { "overflow-hidden": props.scrollable } // Overflow condition.
      ),
    }),
    navContent:
      "overflow-y-hidden overscroll-container overscroll-auto scroll-smooth [&::-webkit-scrollbar]:hidden", // Overflow and scrollbar styles.
    previousButton: {
      className: classNames(
        "h-full flex items-center justify-center !absolute top-0 z-20",
        "left-0",
        "bg-white text-blue-500 w-12 shadow-md rounded-none"
        // "dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 )"
      ), // Flex and absolute positioning styles.
    },
    nextButton: {
      className: classNames(
        "h-full flex items-center justify-center !absolute top-0 z-20",
        "right-0",
        "bg-white text-blue-500 w-12 shadow-md rounded-none"
        // "dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 "
      ), // Flex and absolute positioning styles.
    },
    nav: {
      className: classNames(
        "flex flex-1 list-none m-0 p-0",
        "bg-transparent border border-gray-300 border-0 border-b-2"
        // "dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80 "
      ), // Flex, list, margin, padding, and border styles.
    },
  },
  tabpanel: {
    header: ({ props }: any) => ({
      className: classNames("mr-0", {
        "cursor-default pointer-events-none select-none user-select-none opacity-60":
          props?.disabled,
      }), // Margin and condition-based styles.
    }),
    headerAction: ({ parent, context }: any) => ({
      className: classNames(
        "items-center cursor-pointer flex overflow-hidden relative select-none text-decoration-none user-select-none", // Flex and overflow styles.
        "border-b-2 p-5 font-bold rounded-t-md transition-shadow duration-200 m-0", // Border, padding, font, and transition styles.
        "transition-colors duration-200", // Transition duration style.
        // "focus:outline-none focus:outline-offset-0 focus:shadow-[inset_0_0_0_0.2rem_rgba(191,219,254,1)]", // Focus styles.
        {
          "border-gray-300 bg-white text-gray-700 hover:bg-white hover:border-gray-400 hover:text-gray-600":
            parent != null ? parent.state.activeIndex !== context.index : true, // Condition-based hover styles.
          "bg-white border-blue-500 text-primary":
            parent != null ? parent.state.activeIndex === context.index : false, // Condition-based active styles.
        }
      ),
      style: { marginBottom: "-2px" }, // Negative margin style.
    }),
    headerTitle: {
      className: classNames("leading-none whitespace-nowrap max-sm:text-sm"), // Leading and whitespace styles.
    },
    content: {
      className: classNames(
        "bg-white p-5 border-0 text-gray-700 rounded-bl-md rounded-br-md"
        // "dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80"
      ), // Background, padding, border, and text styles.
    },
  },
};
