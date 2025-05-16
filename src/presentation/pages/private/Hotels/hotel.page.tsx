/* import {
  
  useUploadExcelMutation,
} from "@/infraestructure/store/services";
import { FileUpload } from "@/presentation/components";
import { FileUpload as FileUploadType } from "primereact/fileupload";
import { useRef } from "react"; 
import { NewHotelDialog } from "./components/NewHotelDialog";*/
import { HotelTable } from "./components/HotelTable";

const Hotelpage = () => {
  /* const [uploadExcel, { isLoading }] = useUploadExcelMutation(); */
  
  

/*   const fileUploadRef = useRef<FileUploadType>(null);

  const onUpload = async (event: any) => {
    const file = event.files[0];

    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      await uploadExcel(formData).unwrap();
      formData.delete("file");

      fileUploadRef.current?.clear();
    } catch (error) {
      console.log("Error uploading file:", error);
      fileUploadRef.current?.clear();
    }
  }; */

  return (
    <div className="bg-white p-10 rounded-lg shadow-md overflow-x-hidden">
    {/*   <div className="flex justify-end flex-wrap gap-y-5 space-x-4">
        <FileUpload
          ref={fileUploadRef}
          mode="basic"
          accept=".xls,.xlsx"
          chooseLabel="Importar"
          auto
          customUpload
          uploadHandler={onUpload}
          onUpload={onUpload}
          name="file"
          disabled={isLoading}
        />

        <NewHotelDialog />

        
      </div> */}
      <HotelTable />
    </div>
  );
};

export default Hotelpage;
