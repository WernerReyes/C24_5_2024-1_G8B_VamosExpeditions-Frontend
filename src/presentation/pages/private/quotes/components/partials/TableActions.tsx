import { QuoteEntity, VersionEntity } from "@/domain/entities";
import { Button } from "@/presentation/components";

type TyoeTableActions = {
  rowData: QuoteEntity | VersionEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type }: TyoeTableActions) => {
  return (
    <div className="space-x-2">
      <Button icon="pi pi-pencil" rounded outlined />
      <Button icon="pi pi-eye" rounded outlined />
      <Button icon="pi pi-file-pdf" rounded outlined />
      {type === "principal" && (
        <Button icon="pi pi-envelope" rounded outlined />
      )}
      <Button icon="pi pi-trash" rounded outlined severity="danger" />
    </div>
  );
};
