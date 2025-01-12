import {
  ConfirmDialog as ConfirmDialogPrimeReact,
  type ConfirmDialogProps,
} from "primereact/confirmdialog";
import { Button } from "./Button";

interface Props extends ConfirmDialogProps {}
export const ConfirmDialog = ({ ...props }: Props) => {
  if (props.group === "headless") return <ConfirmDialogHeadless {...props} />;
  return <ConfirmDialogPrimeReact {...props} />;
};

const ConfirmDialogHeadless = ({ accept, reject, ...props }: Props) => {
  return (
    <ConfirmDialogPrimeReact
      group="headless"
      content={({ headerRef, contentRef, footerRef, hide, message }) => (
        <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
          <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
            <i className="pi pi-question text-5xl"></i>
          </div>
          <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
            {message.header}
          </span>
          <p
            className="mb-0"
            ref={contentRef as React.RefObject<HTMLParagraphElement>}
          >
            {message.message}
          </p>
          <div
            className="flex align-items-center gap-2 mt-4"
            ref={footerRef as React.RefObject<HTMLDivElement>}
          >
            <Button
              label="Save"
              onClick={(event) => {
                hide(event);
                if (accept) accept();
              }}
              className="w-8rem"
            ></Button>
            <Button
              label="Cancel"
              outlined
              onClick={(event) => {
                hide(event);
                if (reject) reject();
              }}
              className="w-8rem"
            ></Button>
          </div>
        </div>
      )}
      {...props}
    />
  );
};
