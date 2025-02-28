import React, { useState } from "react";
import type { AppState } from "@/app/store";
import { constantRoutes } from "@/core/constants";
import {
  onSetCurrentStep,
  onSetOperationType,
} from "@/infraestructure/store";
import { useCreateQuotationMutation } from "@/infraestructure/store/services";
import { Button, ConfirmDialog } from "@/presentation/components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCleanStore } from "@/infraestructure/hooks";

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
  const { cleanGenerateNewQuotation, cleanChangeEditQuotation, cleanChangeNewQuotation } =
    useCleanStore();
  const [visible, setVisible] = useState(false);

  const handleAccept = async () => {
    cleanGenerateNewQuotation();
    await createQuotation()
      .unwrap()
      .then(() => {
        dispatch(onSetOperationType("replace"));

        dispatch(onSetCurrentStep(0));
        navigate(NEW_QUOTE);
        setVisible(false);
      });
  };

  const handleReject = () => {
    cleanChangeEditQuotation();
    setVisible(false);
    navigate(NEW_QUOTE);
    dispatch(onSetOperationType("create"));
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
              cleanChangeNewQuotation();
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
          onClick={async () => {
            if (currentQuotation) {
              setVisible(true);
            } else {
              cleanChangeNewQuotation();
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
