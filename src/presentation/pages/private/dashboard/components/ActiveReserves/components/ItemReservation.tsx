import { cn, dateFnsAdapter } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import { ReservationEntity } from "@/domain/entities";
import { Avatar, Button, Card } from "@/presentation/components";
import { useState } from "react";
import { MoreInformation } from "../../MoreInformation";

type Props = {
  reservation: ReservationEntity;
};

export const ItemReservation = ({ reservation }: Props) => {
  const [expanded, setExpanded] = useState(false);
  const clientFullname =
    reservation.versionQuotation?.tripDetails?.client?.fullName || "";
  const tripDetails = reservation.versionQuotation?.tripDetails;

  const handleViewDetails = (id: number) => {
    alert(`Viewing details for quote ID: ${id}`);
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-x-1 text-gray-500 mb-3">
          <i className="pi pi-file text-gray-400"></i>
          <span className="text-sm">Reserva: {reservation.id}</span>
        </div>
      }
      className="hover:bg-gray-100 transition duration-200 group"
      key={reservation.id}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center w-full sm:w-auto">
          <Avatar
            size="large"
            shape="circle"
            className="max-sm:text-lg"
            label={clientFullname}
          />
          <div className="ml-3 text-sm">
            <h3 className="text-gray-500 font-medium">{clientFullname}</h3>
            <div className="flex gap-x-1 items-center text-gray-400">
              <i className="pi pi-calendar text-gray-500"></i>
              <span>
                {dateFnsAdapter.format(tripDetails!.startDate)} -{" "}
                {dateFnsAdapter.format(tripDetails!.endDate)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
          <div className="text-right mr-4">
            <div className="text-primary text-lg font-semibold">
              {formatCurrency(reservation.versionQuotation?.finalPrice || 0)}
            </div>
          </div>

          <Button
            text
            icon={expanded ? "pi pi-chevron-up" : "pi pi-chevron-down"}
            className="text-gray-400 h-8 w-8 p-0"
            onClick={() => setExpanded(!expanded)}
          />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-x-1 text-gray-500">
          <i className="pi pi-map-marker text-gray-400"></i>
          <span>
            {tripDetails?.cities?.map((city) => city.name).join(" - ")}
          </span>
        </div>

        <div className="flex items-center text-gray-500">
          <i
            className={cn(
              "text-gray-400 me-1.5 text-sm pi ",
              tripDetails?.numberOfPeople === 1 ? "pi-user" : "pi-users"
            )}
          ></i>
          <span>
            {tripDetails?.numberOfPeople === 1
              ? "1 persona"
              : `${tripDetails?.numberOfPeople} personas`}
          </span>
        </div>
      </div>

      {expanded && (
        <MoreInformation
          createdAt={reservation.createdAt}
          updatedAt={reservation.updatedAt}
          userFullname={
            reservation.versionQuotation?.user?.fullname ||
            "Usuario desconocido"
          }
          handleViewDetails={() => handleViewDetails(reservation.id)}
        />
      )}
    </Card>
  );
};
