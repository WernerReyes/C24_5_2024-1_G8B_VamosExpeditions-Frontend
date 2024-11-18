import { QuoteEntity, VersionEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";

type TyoeTableActions = {
  rowData: QuoteEntity | VersionEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type }: TyoeTableActions) => {
  return (
    <div className="space-x-1">
      <Button rounded text icon="pi pi-pencil" />
      <Button icon="pi pi-eye" rounded text />
      <Button icon="pi pi-file-pdf" rounded text />
      {type === "principal" && <Button icon="pi pi-envelope" rounded text />}
      <Button icon="pi pi-trash" rounded text severity="danger" />
    </div>
  );
};
