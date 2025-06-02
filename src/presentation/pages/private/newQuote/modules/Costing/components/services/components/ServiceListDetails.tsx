import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import type { ServiceTripDetailsEntity } from "@/domain/entities";
import { measureExecutionTime } from "@/core/utils";
import { dateFnsAdapter } from "@/core/adapters";
import {
  ListDetailsSkeleton,
  ServiceListDetailsHeader,
} from "../../../../components";

export const ServiceListDetails = () => {
  const { serviceTripDetails, isFetchingServiceTripDetails } = useSelector(
    (state: AppState) => state.serviceTripDetails
  );
  const { selectedDay } = useSelector((state: AppState) => state.quotation);

  const [contentLoading, setContentLoading] = useState(true);

  const serviceTripDetailsPerDay: ServiceTripDetailsEntity[] = useMemo(() => {
    if (selectedDay && serviceTripDetails.length > 0) {
      const { result, executionTime } = measureExecutionTime(function () {
        return serviceTripDetails.filter((detail) => {
          return dateFnsAdapter.isSameDay(detail.date, selectedDay.date);
        });
      });

      setTimeout(() => {
        setContentLoading(false);
      }, executionTime);

      return result;
    }
    return [];
  }, [selectedDay, serviceTripDetails]);

  const length =
    serviceTripDetailsPerDay.length > 0 ? serviceTripDetailsPerDay.length : 4;

  return (
    <>
      {serviceTripDetailsPerDay.length === 0 ? (
        <p className="text-center max-sm:text-sm bg-secondary p-2 md:w-3/4 mx-auto rounded-md text-gray-500">
          Ningún servicio por ahora
        </p>
      ) : (
        <div className="thin-scrollbar w-full grid lg:grid-cols-2 3xl:grid-cols-3 max-h-96 sm:max-h-[34rem] p-2 overflow-y-auto gap-x-4 gap-y-8 justify-items-center jus bg-white">
          {contentLoading || isFetchingServiceTripDetails ? (
            Array.from({ length }).map((_, index) => (
              <ListDetailsSkeleton key={index} />
            ))
          ) : (
            <>
              {serviceTripDetailsPerDay.map((detail) => (
                <div
                  key={detail.id}
                  className="w-full max-w-sm bg-white shadow-lg rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <ServiceListDetailsHeader detail={detail} />
                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Grid */}
                    <div className="grid gap-6 min-[350px]:grid-cols-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <i className="pi pi-user text-primary me-1"></i>
                          Capacidad
                        </div>
                        {detail?.service?.passengersMin ? (
                          <div className="flex items-center space-x-1">
                            <i className="pi pi-users" />
                            <div className="flex gap-x-1">
                              <span>{detail?.service.passengersMin}</span>
                              {detail?.service.passengersMax && (
                                <>- {detail?.service.passengersMax}</>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="font-semibold">
                            No hay limite
                          </p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <i className="pi pi-clock text-primary me-1"></i>
                          Duración
                        </div>
                        <p className="font-semibold">
                          {detail.service?.duration ?? "Sin duración"}
                        </p>
                      </div>
                    </div>

                   

                    {/* Footer */}
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <i className="pi text-2xl pi-money-bill text-primary me-1"></i>

                          <span className="font-medium hidden min-[350px]:block">
                            Costo
                          </span>
                        </div>
                        <span className="text-xl lg:text-2xl font-bold text-primary">
                          ${detail.costPerson}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </>
  );
};
