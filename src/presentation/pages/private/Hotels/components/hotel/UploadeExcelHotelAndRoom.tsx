import { useUploadExcelHotelAndRoomMutation } from "@/infraestructure/store/services";
import { FileUpload } from "@/presentation/components";
import { FileUpload as FileUploadType } from "primereact/fileupload";
import { useRef } from "react";
export const UploadeExcelHotelAndRoom = () => {
  const [uploadExcelHotelAndRoom, { isLoading }] =
    useUploadExcelHotelAndRoomMutation();

  const fileUploadRef = useRef<FileUploadType>(null);

  const onUpload = async (event: any) => {
    const file = event.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      await uploadExcelHotelAndRoom(formData).unwrap();
      formData.delete("file");

      fileUploadRef.current?.clear();
    } catch (error) {
      console.log("Error uploading file:", error);
      fileUploadRef.current?.clear();
    }
  };

  return (
    <FileUpload
      ref={fileUploadRef}
      mode="basic"
      accept=".xls,.xlsx"
      chooseLabel="Importar"
      chooseOptions={{
        icon: isLoading ? "pi pi-spin pi-spinner" : "pi pi-file-excel",
      }}
      auto
      customUpload
      uploadHandler={onUpload}
      onUpload={onUpload}
      name="file"
      disabled={isLoading}
    />
  );
};
