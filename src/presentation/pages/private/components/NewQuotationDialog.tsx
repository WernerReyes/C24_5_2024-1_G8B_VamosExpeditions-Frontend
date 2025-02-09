import React, { useState } from "react";
import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import { quotationService } from "@/data";
import {
  onSetCurrentQuotation,
  onSetCurrentStep,
} from "@/infraestructure/store";
import { useCreateQuotationMutation } from "@/infraestructure/store/services";
import { Button, ConfirmDialog } from "@/presentation/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const { NEW_QUOTE } = constantRoutes.private;

type Props = {
  children?: React.ReactNode;
};

export const NewQuotationDialog = ({ children }: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuotation } = useSelector(
    (state: AppState) => state.quotation
  );
  const [createQuotation] = useCreateQuotationMutation();
  const [visible, setVisible] = useState(false);

  const handleAccept = async () => {
    setVisible(false);
    await quotationService.deleteCurrentQuotation();
    dispatch(onSetCurrentQuotation(null));
    dispatch(onSetCurrentStep(0));
    await createQuotation();
    navigate(NEW_QUOTE);
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
          onClick={async() => {
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
