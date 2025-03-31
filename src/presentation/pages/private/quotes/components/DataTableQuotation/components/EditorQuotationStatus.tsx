import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import {
  ReservationStatus,
  type VersionQuotationEntity,
  versionQuotationRender,
  VersionQuotationStatus,
} from "@/domain/entities";
import {
  useUpdateVersionQuotationMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import {
  Dropdown,
  type DropdownChangeEvent,
  Tag,
} from "@/presentation/components";
import type { ColumnEditorOptions } from "primereact/column";

type Props = {
  options: ColumnEditorOptions;
  setSelectedQuotation: (quotation: VersionQuotationEntity) => void;
};
export const EditorQuotationStatus = ({
  options,
  setSelectedQuotation,
}: Props) => {
  const [upsertReservation] = useUpsertReservationMutation();
  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();

  const handleApproveQuotationAndCreateReservation = async (
    e: DropdownChangeEvent
  ) => {
    if (e.value === options.value) return;

    if (options.rowData.official && options.rowData.reservation &&  e.value  === VersionQuotationStatus.CANCELATED) {
        setSelectedQuotation(options.rowData);
      
      return options.editorCallback?.(e.value);
    }

    if (
      e.value === VersionQuotationStatus.APPROVED &&
      options.rowData.official
    ) {
      upsertReservation({
        id: 0,
        status: ReservationStatus.PENDING,
        quotationId: options.rowData.id.quotationId,
      })
        .unwrap()
        .then(() => {
          options.editorCallback?.(e.value);
        });
    } else {
      updateVersionQuotation(
        versionQuotationDto.parse({
          ...options.rowData,
          status: e.value,
        })
      )
        .unwrap()
        .then(() => {
          options.editorCallback?.(e.value);
        });
    }
  };

  return (
    <Dropdown
      value={options.rowData.status}
      options={[
        {
          ...versionQuotationRender[VersionQuotationStatus.APPROVED],
          value: VersionQuotationStatus.APPROVED,
        },
        {
          ...versionQuotationRender[VersionQuotationStatus.CANCELATED],
          value: VersionQuotationStatus.CANCELATED,
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
          versionQuotationRender[options.value as VersionQuotationStatus];
        return <Tag value={label} severity={severity} icon={icon} />;
      }}
      onChange={handleApproveQuotationAndCreateReservation}
      placeholder="Seleccionar tipo de cotización"
      className="w-full"
    />
  );
};
