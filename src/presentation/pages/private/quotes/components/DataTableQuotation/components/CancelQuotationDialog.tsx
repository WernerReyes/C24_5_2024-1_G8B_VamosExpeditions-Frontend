import { dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import {
  type VersionQuotationEntity,
  VersionQuotationStatus,
} from "@/domain/entities";
import {
  useCancelAndReplaceApprovedOfficialVersionQuotationMutation,
  useCancelReservationMutation,
  useGetAllUnofficialVersionQuotationsQuery,
} from "@/infraestructure/store/services";
import { Button, Dialog, RadioButton } from "@/presentation/components";
import { useEffect, useState } from "react";

const RESERVATION_ACTIONS = {
  EDIT_REFERENCE: "editReference",
  CANCEL_RESERVATION: "cancelReservation",
} as const;

type ReservationActionKeys = keyof typeof RESERVATION_ACTIONS;

type Props = {
  selectedQuotation?: VersionQuotationEntity;
  setSelectedQuotation: (quotation?: VersionQuotationEntity) => void;
};
export const CancelQuotationDialog = ({
  selectedQuotation,
  setSelectedQuotation,
}: Props) => {
  const { currentData } = useGetAllUnofficialVersionQuotationsQuery(
    {
      limit: 10,
      page: 1,
      quotationId: selectedQuotation?.id.quotationId,
      status: [VersionQuotationStatus.APPROVED],
    },
    {
      skip: !selectedQuotation,
    }
  );
  //   const {} =
  const [cancelAndReplaceApprovedOfficialVersionQuotation] =
    useCancelAndReplaceApprovedOfficialVersionQuotationMutation();

  const [cancelReservation] =
    useCancelReservationMutation();

  const [selectedAction, setSelectedAction] =
    useState<ReservationActionKeys>("EDIT_REFERENCE");
  const [selectedVersion, setSelectedVersion] = useState<number | undefined>(
    undefined
  );

  const unofficialQuotations = currentData?.data?.content;

  const handleApplyChanges = () => {
    if (!selectedQuotation) return;
    if (selectedAction === "CANCEL_RESERVATION") {
      if (!selectedQuotation.reservation) {
        alert("No se puede cancelar la reserva");
      };
      cancelReservation(selectedQuotation.reservation?.id || 0)
        .unwrap()
        .then(() => {
          setSelectedQuotation(undefined);
        });
      return;
    }

    if (!unofficialQuotations || !selectedVersion) return;

    cancelAndReplaceApprovedOfficialVersionQuotation({
      quotationId: selectedQuotation.id.quotationId,
      versionNumber: selectedVersion,
    })
      .unwrap()
      .then(() => {
        setSelectedQuotation(undefined);
      });
  };

  useEffect(() => {
    if (unofficialQuotations && !selectedVersion) {
      setSelectedVersion(unofficialQuotations[0]?.id.versionNumber);
    }
  }, [unofficialQuotations]);

  return (
    <Dialog
      header="Motivo de cancelación"
      headerClassName="text-primary"
      visible={!!selectedQuotation}
      onHide={() => setSelectedQuotation(undefined)}
      style={{ maxWidth: "30rem" }}
    >
      <p className="text-center">
        Estas a punto de cancelar la versión oficial. Se debe seleccionar otra
        versión aprobada para reemplazarla.
      </p>

      {selectedQuotation && (
        <>
          <div className="my-4">
            <h4 className="font-bold mb-2 text-primary">
              Cotización oficial actual
            </h4>
            <div className="ml-3 grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-400">ID:</span>{" "}
                {selectedQuotation.id.quotationId}
              </div>
              <div>
                <span className="text-gray-400">Version:</span> v
                {selectedQuotation.id.versionNumber}
              </div>
              <div>
                <span className="text-gray-400">Cliente: </span>
                {selectedQuotation.tripDetails?.client?.fullName}
              </div>
              <div>
                <span className="text-gray-400">Monto: </span>
                {formatCurrency(selectedQuotation.finalPrice || 0)}
              </div>
            </div>
          </div>

          {selectedAction === "EDIT_REFERENCE" && (
            <div className="my-4">
              <h4 className="font-bold mb-2 text-primary">
                Seleccionar otra versión
              </h4>
              {unofficialQuotations &&
                unofficialQuotations.length > 0 &&
                unofficialQuotations?.map((quotation) => (
                  <div
                    className="ml-3 flex align-items-center"
                    key={quotation.id.versionNumber}
                  >
                    <RadioButton
                      inputId={quotation.id.versionNumber.toString()}
                      name="version"
                      value={quotation.id.versionNumber}
                      checked={selectedVersion === quotation.id.versionNumber}
                      onChange={(e) => {
                        setSelectedVersion(Number(e.target.value));
                      }}
                    />
                    <label
                      htmlFor={quotation.id.versionNumber.toString()}
                      className="ml-2"
                    >
                      Versión {quotation.id.versionNumber}
                      <span className="text-gray-400 block">
                        {formatCurrency(quotation.finalPrice || 0)} -
                        {dateFnsAdapter.format(quotation.createdAt)}
                      </span>
                    </label>
                  </div>
                ))}

              {unofficialQuotations?.length === 0 && (
                <p className="ml-3 text-gray-400">
                  No hay cotizaciones aprobadas
                </p>
              )}
            </div>
          )}

          <div className="my-4">
            <h4 className="font-bold mb-2 text-primary">
              Acción de la reserva
            </h4>
            {Object.entries(RESERVATION_ACTIONS).map(([key, value]) => (
              <div className="ml-3 flex align-items-center" key={key}>
                <RadioButton
                  inputId={value}
                  checked={selectedAction === key}
                  value={key}
                  onChange={(e) => {
                    setSelectedAction(e.target.value as ReservationActionKeys);
                  }}
                />
                <label htmlFor={value} className="ml-2">
                  {key === "EDIT_REFERENCE"
                    ? "Editar la referencia"
                    : "Solo cancelar la reserva"}
                  <span className="text-gray-400 block">
                    {key === "EDIT_REFERENCE"
                      ? "Mantener la reserva actual y editar la referencia a la nueva versión seleccionada"
                      : "Cancelar la reserva actual sin reemplazarla por otra"}
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-10 md:flex gap-x-2 justify-end">
            <Button
              disabled={
                unofficialQuotations?.length === 0 &&
                selectedAction === "EDIT_REFERENCE"
              }
              onClick={handleApplyChanges}
              label="Aplicar cambios"
              className="max-sm:w-full"
            />
            <Button
              label="Cancelar"
              outlined
              onClick={() => setSelectedQuotation(undefined)}
              className="max-sm:w-full max-sm:mt-2"
            />
          </div>
        </>
      )}
    </Dialog>
  );
};
