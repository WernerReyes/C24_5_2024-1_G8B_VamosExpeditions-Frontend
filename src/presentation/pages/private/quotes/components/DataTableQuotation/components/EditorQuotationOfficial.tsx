import { cn } from "@/core/adapters";
import { ReservationStatus, VersionQuotationStatus } from "@/domain/entities";
import {
  useUpdateOfficialVersionQuotationMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import { type ColumnEditorOptions, Dropdown } from "@/presentation/components";

type Props = {
  options: ColumnEditorOptions;
};

export const EditorQuotationOfficial = ({ options }: Props) => {
  const [updateOfficialVersionQuotation] =
    useUpdateOfficialVersionQuotationMutation();
  const [upsertReservation] = useUpsertReservationMutation();

  return (
    <Dropdown
      value={options.rowData.official}
      options={[{ label: "Oficial", value: true }]}
      itemTemplate={() => <i className="pi pi-check-circle" />}
      valueTemplate={() => {
        return (
          <i
            className={cn(
              "pi",
              options.value ? "pi-check-circle" : "pi-times-circle"
            )}
          />
        );
      }}
      onChange={(e) => {
        if (e.value === options.value) return;
        updateOfficialVersionQuotation({
          versionNumber: options.rowData.id.versionNumber,
          quotationId: options.rowData.id.quotationId,
        })
          .unwrap()
          .then(({ data }) => {
            options.editorCallback?.(e.value);
            if (data.newOfficial.status === VersionQuotationStatus.APPROVED) {
              upsertReservation({
                id: 0,
                quotationId: options.rowData.id.quotationId,
                status: ReservationStatus.PENDING,
              });
            }
          });
      }}
      placeholder="Seleccionar tipo de cotización"
      className="w-full"
    />
  );
};
