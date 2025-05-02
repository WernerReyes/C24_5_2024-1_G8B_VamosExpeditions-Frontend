type Props = {
  blob: Blob;
};
import { useEffect, useState } from "react";
import { Dialog } from "./Dialog";

export const PDFPreview = ({ blob }: Props) => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl); // Clean up
  }, [blob]);

  if (!url) return <p>Loading PDF...</p>;

  return (
    <Dialog
      visible={true}
      onHide={() => setUrl(null)}
      className="w-full max-w-4xl max-h-[90vh]"
      pt={{
        header: { className: "hidden" },
      }}
      maximized
      modal
      contentClassName="p-0"
    >
      <i
        className="pi pi-times absolute text-xs top-2 right-2 text-white hover:text-slate-200 cursor-pointer"
        onClick={() => setUrl(null)}
      ></i>
      <iframe
        src={url}
        width="100%"
        name="pdf-preview"
        height="100%"
        title="PDF Preview"
        style={{ border: "none" }}
      />
    </Dialog>
  );
};
