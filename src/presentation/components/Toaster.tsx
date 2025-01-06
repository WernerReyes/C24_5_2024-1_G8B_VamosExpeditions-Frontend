import { classNames } from "primereact/utils";
import toast, {
  type Toast,
  ToastBar,
  Toaster as ToasterHot,
} from "react-hot-toast";
import { Button } from "./Button";
import { useAuthStore } from "@/infraestructure/hooks";

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
  dismiss: (id?: string) => toast.dismiss(id),
  remove: (message: string) => toast.remove(message),
  tokenExpired: () => {
    return toast.custom((t) => <LogoutToast t={t} />, {
      duration: 100000000,
      position: "top-center",
    });
  },
};

const LogoutToast = ({ t }: { t: Toast }) => {
  const { startLogout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await new Promise((resolve) => {
        toast.dismiss(t.id);
        setTimeout(resolve, 1500); //* Wait for the toast to close
      });
      await startLogout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="bg-[#F4F4F5] border-l-4 border-[#01A3BB] p-4 rounded-lg shadow-md flex items-start">
      <i className="w-5 h-5 mr-3 text-[#01A3BB] pi pi-info-circle" />
      <div className="flex-grow">
        <h3 className="font-semibold mb-1 text-gray-800">
          Su sesión ha expirado
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Por favor, vuelva a iniciar sesión
        </p>
      </div>
      <Button
        onClick={() => handleLogout()}
        icon="pi pi-times"
        rounded
        text
        className="ml-4 text-gray-500"
      />
    </div>
  );
};
