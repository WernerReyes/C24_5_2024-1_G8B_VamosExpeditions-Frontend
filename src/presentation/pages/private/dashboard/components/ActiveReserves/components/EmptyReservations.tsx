import { cn } from "@/core/adapters";
import { Card } from "@/presentation/components";
import { useState } from "react";

export const EmptyReservations = () => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Card
      className="text-center transition-all duration-300"
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
                "pi text-4xl transition-all pi-calendar duration-500",
                isHovering ? "text-primary" : "text-gray-300"
              )}
            ></i>
          </div>

          {isHovering && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
              <div className="animate-bounce flex justify-center mt-[-20px]">
                {/* <PlusCircle className="h-6 w-6 text-teal-500" /> */}
                <i className="pi pi-plus-circle text-teal-500 text-xl"></i>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-medium text-gray-700 mb-2">
          No tienes reservas activas
        </h3>
        <p className="text-gray-500 mb-6">
          Cuando crees una reserva, aparecerá aquí para que puedas gestionarla
          fácilmente.
        </p>
      </div>
    </Card>
  );
};
