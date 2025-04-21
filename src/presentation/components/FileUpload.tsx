import {
    FileUpload as FileUploadPrimeReact,
    type FileUploadProps,
  } from "primereact/fileupload";
  import { forwardRef } from "react";
  
  interface Props extends FileUploadProps {}
  
 export  const FileUpload = forwardRef<FileUploadPrimeReact, Props>((props, ref) => {
    return <FileUploadPrimeReact {...props} ref={ref} />;
  });