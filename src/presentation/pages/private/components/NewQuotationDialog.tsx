import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { useCreateQuotationMutation } from "@/infraestructure/store/services";
import { Button, ConfirmDialog } from "@/presentation/components";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { NEW_QUOTE } = constantRoutes.private;

type Props = {
  children?: React.ReactNode;
  outlined?: boolean;
};

export const NewQuotationDialog = ({ children, outlined }: Props) => {
 
  const navigate = useNavigate();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const [createQuotation] = useCreateQuotationMutation();
  
  const [visible, setVisible] = useState(false);

  const handleAccept = async () => {
    await createQuotation()
      .unwrap()
      .then(() => {
        navigate(NEW_QUOTE);
        setVisible(false);
      });
  };

  const handleReject = () => {
  
    setVisible(false);
    navigate(NEW_QUOTE);
 
  };

  return (
    <>
      <ConfirmDialog
        group="declarative"
        visible={visible}
        onHide={() => setVisible(false)}
        message="Tienes una cotización en proceso, ¿deseas reemplazarla?"
        header="Nueva cotización"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        accept={handleAccept}
        rejectLabel="No"
        reject={handleReject}
      />
      {children && React.isValidElement(children) ? (
        React.cloneElement(children as React.ReactElement<any>, {
          onClick: async () => {
            if (currentQuotation) {
              setVisible(true);
            } else {
              await createQuotation().then(() => {
                navigate(NEW_QUOTE);
              });
            }
          },
        })
      ) : (
        <Button
          label="Nueva cotización"
          icon="pi pi-plus-circle"
          outlined={outlined}
          onClick={async () => {
            if (currentQuotation) {
              setVisible(true);
            } else {
              await createQuotation().then(() => {
                navigate(NEW_QUOTE);
              });
            }
          }}
        />
      )}
    </>
  );
};
