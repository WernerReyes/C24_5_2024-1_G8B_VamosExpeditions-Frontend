import { classNames } from "primereact/utils";
import toast, { ToastBar, Toaster as ToasterHot } from "react-hot-toast";

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
        duration: 5000,
      }}
      position="top-right"
      gutter={5}
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
                  onClick={() => toast.dismiss(t.id)}
                ></i>
              </div>
            );
          }}
        </ToastBar>
      )}
    </ToasterHot>
  );
};

export const toasterAdapter = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) =>
    toast.custom((t) => {
      return (
        <div className="text-white p-4 rounded-lg w-[22rem] shadow-md flex items-start bg-yellow-500">
          <div className="mr-4">
            <i className="pi pi-exclamation-triangle"></i>
          </div>
          <div className="flex-grow text-xs sm:text-sm">
            <h3 className="font-semibold mb-1 text-md">Warning</h3>
            {message}
          </div>
          <i
            className="pi pi-times cursor-pointer hover:bg-transparent/10 p-2 rounded-full hover:text-white"
            onClick={() => toast.dismiss(t.id)}
          ></i>
        </div>
      );
    }),
  info: (message: string) =>
    toast.custom((t) => {
      return (
        <div className="text-white p-4 rounded-lg w-[22rem] shadow-md flex items-start bg-blue-500">
          <div className="mr-4">
            <i className="pi pi-info-circle"></i>
          </div>
          <div className="flex-grow text-xs sm:text-sm">
            <h3 className="font-semibold mb-1 text-md">Info</h3>
            {message}
          </div>
          <i
            className="pi pi-times cursor-pointer hover:bg-transparent/10 p-2 rounded-full hover:text-white"
            onClick={() => toast.dismiss(t.id)}
          ></i>
        </div>
      );
    }),
  dismiss: (id?: string) => toast.dismiss(id),
  remove: (message: string) => toast.remove(message),
  connected: (browser: string, os: string) =>
    toast.custom((t) => {
      return (
        <div
          className={`flex items-start p-4 rounded-lg shadow-md bg-white border-l-4 border-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
          style={{ width: "22rem" }}
        >
          <div className="mr-4 text-green-500">
            <i className="pi pi-wifi text-xl"></i>
          </div>
          <div className="flex-grow text-sm">
            <h3 className="font-semibold text-md text-gray-800">
              Nueva conexión detectada en
            </h3>
            <p className="text-gray-600">{`${browser} on ${os}`}</p>
          </div>
          <i
            className="pi pi-times cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={() => toast.dismiss(t.id)}
          ></i>
        </div>
      );
    }),

  disconnectDevice: (browser: string, os: string) =>
    toast.custom((t) => {
      return (
        <div
          className={`flex items-start p-4 rounded-lg shadow-md bg-white border-l-4 border-primary ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
          style={{ width: "22rem" }}
        >
          <div className="mr-4 text-red-500">
            <i className="pi pi-wifi-off text-xl"></i>
          </div>
          <div className="flex-grow text-sm">
            <h3 className="font-semibold text-md text-gray-800">
              Dispositivo desconectado
            </h3>
            <p className="text-gray-600">{`${browser} on ${os}`}</p>
          </div>
          <i
            className="pi pi-times cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={() => toast.dismiss(t.id)}
          ></i>
        </div>
      );
    }),
};
