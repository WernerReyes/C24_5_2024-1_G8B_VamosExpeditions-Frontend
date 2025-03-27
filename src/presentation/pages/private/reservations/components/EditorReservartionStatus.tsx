import {
  ReservationEntity,
  ReservationStatus,
  reservationStatusRender,
} from "@/domain/entities";
import { useUpsertReservationMutation } from "@/infraestructure/store/services";
import { Dropdown, Tag } from "@/presentation/components";
import type { ColumnEditorOptions } from "primereact/column";

type Props = {
  options: ColumnEditorOptions;
  setCancelReservation: (cancelReservation: ReservationEntity) => void;
};
export const EditorReservationStatus = ({
  options,
  setCancelReservation,
}: Props) => {
  const [upsertReservation] = useUpsertReservationMutation();

  const handleUpdateStatus = async (status: ReservationStatus) => {
    if (!options.rowData.id) return;

    if (status === ReservationStatus.REJECTED) {
      setCancelReservation(options.rowData);
      return;
    }
    
    await upsertReservation({
      quotationId: options.rowData.versionQuotation.id.quotationId,
      status,
      id: options.rowData.id,
    });

    options.editorCallback?.(options.value);
  };

  return (
    <Dropdown
      value={options.rowData.status}
      options={[
        {
          ...reservationStatusRender[ReservationStatus.ACTIVE],
          value: ReservationStatus.ACTIVE,
        },
        {
          ...reservationStatusRender[ReservationStatus.REJECTED],
          value: ReservationStatus.REJECTED,
        },
        {
          ...reservationStatusRender[ReservationStatus.PENDING],
          value: ReservationStatus.PENDING,
        },
      ]}
      itemTemplate={(option) => (
        <Tag
          value={option.label}
          severity={option.severity}
          icon={option.icon}
        />
      )}
      valueTemplate={() => {
        const { label, severity, icon } =
          reservationStatusRender[
            (options.value ?? options.rowData.status) as ReservationStatus
          ];
        return <Tag value={label} severity={severity} icon={icon} />;
      }}
      onChange={(e) => {
        handleUpdateStatus(e.value);
      }}
      placeholder="Seleccionar tipo de cotización"
      className="w-full"
    />
  );
};
