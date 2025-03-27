import { cn } from "@/core/adapters";
import { useEffect, useState } from "react";

export const EmptyQuotations = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [showTip, setShowTip] = useState(false);

  useEffect(() => {
    if (isHovering) {
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 500);

      return () => {
        clearTimeout(timer);
        setShowTip(false);
      };
    }
  }, [isHovering]);

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 relative"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="max-w-md mx-auto">
        <div className="relative">
          <div
            className={cn(
              "bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 transition-all duration-500",
              isHovering && "bg-teal-50"
            )}
          >
            <i
              className={cn(
                "pi text-4xl transition-all pi-file duration-500",
                isHovering ? "text-primary" : "text-gray-300"
              )}
            ></i>
          </div>

          {isHovering && (
            <div className="absolute top-2 right-1/2 translate-x-16">
              <div className="animate-pulse">
                <i className="pi pi-chart-line text-teal-500 text-xl"></i>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No hay cotizaciones recientes
        </h3>
        <p className="text-gray-500 mb-6">
          Las cotizaciones que crees aparecerán aquí para que puedas revisarlas
          y convertirlas en reservas.
        </p>

        {showTip && (
          <div className="absolute top-6 right-6 bg-teal-50 text-teal-700 p-3 rounded-lg shadow-sm border border-teal-100 text-sm max-w-xs animate-fade-in">
            <div className="flex items-start gap-2">
              <div className="bg-teal-100 rounded-full p-1.5 mt-0.5">
                <i className="pi pi-chart-line text-teal-600"></i>
              </div>
              <div className="text-left">
                <p className="font-medium">Consejo:</p>
                <p>
                  Crear cotizaciones te ayuda a gestionar mejor tus ventas
                  potenciales.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
