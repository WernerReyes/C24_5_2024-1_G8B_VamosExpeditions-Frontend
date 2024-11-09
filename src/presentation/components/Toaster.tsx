import { classNames } from "primereact/utils";
import { ToastBar, Toaster as ToasterHot } from "react-hot-toast";
import { toasterAdapter } from "@/core/adapters";

export const Toaster = () => {
  const iconType = (icon: any) => {
    const iconType = icon!.props.toast.type;
    let iconColor = "bg-red-500";
    if (iconType === "success") {
      iconColor = "bg-green-500";
    } else if (iconType === "loading") {
      iconColor = "bg-blue-500";
    }
    return {
      color: iconColor,
      type: iconType.charAt(0).toUpperCase() + iconType.slice(1),
    };
  };

  return (
    <ToasterHot
      toastOptions={{
        className: "bg-red-500",
      }}
      
      position="top-right"
    >
      {(t) => (
        <ToastBar
          style={{
            padding: "0",
          }}
          toast={t}
        >
          {({ icon, message }) => {
            return (
              <div
                className={classNames(
                  "text-white p-4 rounded-lg shadow-md flex items-start",
                  iconType(icon).color
                )}
              >
                <div className="mr-4">{icon}</div>

                <div className="flex-grow text-xs sm:text-sm">
                  <h3 className="font-semibold mb-1 text-md">
                    {iconType(icon).type}
                  </h3>
                  {message}
                </div>
                <i
                  className="pi pi-times cursor-pointer hover:bg-transparent/10 p-2 rounded-full hover:text-white"
                  onClick={() => toasterAdapter.dismiss(t.id)}
                ></i>
              </div>
            );
          }}
        </ToastBar>
      )}
    </ToasterHot>
  );
};
