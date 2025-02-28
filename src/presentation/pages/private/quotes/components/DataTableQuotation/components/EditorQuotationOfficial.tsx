import { useUpdateOfficialVersionQuotationMutation } from "@/infraestructure/store/services";
import { ColumnEditorOptions, Dropdown, Tag } from "@/presentation/components";
type Props = {
  options: ColumnEditorOptions;
};
export const EditorQuotationOfficial = ({ options }: Props) => {
  const [
    updateOfficialVersionQuotation,
  ] = useUpdateOfficialVersionQuotationMutation();

  return (
    <Dropdown
      value={options.rowData.official}
      options={[{ label: "Oficial", value: true }]}
      itemTemplate={(option) => <Tag value={option.label} severity="success" />}
      valueTemplate={() => {
        return (
          <Tag
            value={options.value ? "Oficial" : "No oficial"}
            severity={options.value ? "success" : "warning"}
          />
        );
      }}
      onChange={(e) => {
        if (e.value === options.value) return;
        updateOfficialVersionQuotation({
          versionNumber: options.rowData.id.versionNumber,
          quotationId: options.rowData.id.quotationId,
        }).unwrap().then(() => {
          options.editorCallback?.(e.value);
        })
      }}
      placeholder="Seleccionar tipo de cotización"
      className="w-full"
    />
  );
};
