import { useLocation } from "react-use";
import { Button } from "../Button";
import { constantRoutes } from "@/core/constants";
import { useNavigate } from "react-router-dom";
import { cn } from "@/core/adapters";
import { NewQuotationDialog } from "@/presentation/pages/private/components";

const { BASE } = constantRoutes.private;

type Props = {
  screenSize?: "full" | "partial";
  title?: string;
  message?: string;
};

export const NotFound = ({
  screenSize = "full",
  title = "¡Cotización de viaje no encontrada!",
  message = "Parece que esta cotización se ha perdido en el camino. No te preocupes, podemos ayudarte a encontrar tu destino ideal.",
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isPrivate = location.pathname?.includes(BASE);

  const handleGoHome = () => {
    const route = isPrivate
      ? constantRoutes.private.DASHBOARD
      : constantRoutes.public.LOGIN;
    navigate(route);
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center p-4", {
        "min-h-screen bg-gradient-to-b from-primary/5 to-white":
          screenSize === "full",
      })}
    >
      <div className="w-full max-w-2xl text-center">
        {/* Illustrated Scene */}
        <div className="relative h-64 mb-8">
          {/* Sky background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-[180px] font-bold text-primary/10">404</div>
          </div>

          {/* Clouds */}
          <div className="absolute top-6 left-1/4">
            {/* <Cloud className="h-10 w-10 text-gray-200" /> */}
            <i className="pi pi-cloud text-gray-200 text-4xl"></i>
          </div>
          <div className="absolute top-12 right-1/4">
            {/* <Cloud className="h-8 w-8 text-gray-200" /> */}
            <i className="pi pi-cloud text-gray-200 text-4xl"></i>
          </div>
          <div className="absolute bottom-12 left-1/3">
            {/* <Cloud className="h-6 w-6 text-gray-200" /> */}
            <i className="pi pi-cloud text-gray-200 text-4xl"></i>
          </div>

          {/* Map path */}
          <div className="absolute top-1/2 left-0 right-0">
            <svg
              height="40"
              width="100%"
              viewBox="0 0 500 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0,20 Q125,5 250,20 T500,20"
                stroke="#01a3bb"
                strokeWidth="2"
                strokeDasharray="5 5"
                fill="none"
              />
            </svg>
          </div>

          {/* Origin */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-primary"></div>
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary">
              Origen
            </div>
          </div>

          {/* Destination */}
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              {/* <MapPin className="w-4 h-4 text-red-500" /> */}
              <i className="pi pi-map-marker text-primary"></i>
            </div>
            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs font-medium text-primary">
              Destino
            </div>
          </div>

          {/* Lost plane */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse">
              <div className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-plane-takeoff text-primary text-4xl transform rotate-45 h-8 w-8"
                >
                  <path d="M2 22h20" />
                  <path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-[10px] text-primary">?</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-primary mb-4">
          {title}
        </h3>

        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            icon="pi pi-home"
            label="Volver al inicio"
            onClick={handleGoHome}
          />
          {isPrivate && (
            // <Button icon="pi pi-file" label="Ver cotizaciones" outlined />
            <NewQuotationDialog outlined />
          )}
        </div>
      </div>
    </div>
  );
};
