import type { AppState } from "@/app/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";
import { useUpdateVersionQuotationMutation } from "@/infraestructure/store/services";
import { Button, InputText } from "@/presentation/components";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

export const EditableQuotationName = () => {
  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const [updateVersionQuotation, { isLoading }] =
    useUpdateVersionQuotationMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");

  const handleSave = async () => {
    if (name && name.trim().toUpperCase() !== currentVersionQuotation?.name) {
      await updateVersionQuotation(
        versionQuotationDto.parse({ ...currentVersionQuotation!, name })
      );
    }

    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setName(name);
  };

  useEffect(() => {
    setName(currentVersionQuotation?.name ?? "");
  }, [currentVersionQuotation]);

  return (
    <div className="flex items-center mx-auto max-sm:ml-8 p-4 justify-center text-2xl rounded-lg">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <div className="flex justify-center items-center gap-2">
            <InputText
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 w-full focus-visible:ring-primary"
              autoFocus
              disabled={isLoading}
            />
            <Button
              icon="pi pi-check"
              onClick={handleSave}
              className="h-8 w-8"
              text
              disabled={isLoading}
            />
            <Button
              text
              icon="pi pi-times"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 w-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            />
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#00A7B5]">
              {currentVersionQuotation?.name}
            </span>
            <Button
              text
              icon="pi pi-pencil"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="h-8 w-8"
            />
          </div>
        )}
      </div>
    </div>
  );
};
