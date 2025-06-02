import { formatCurrency } from "@/core/utils";
import type { ServiceEntity } from "@/domain/entities";
import { Button, Card, InputNumber, Tag } from "@/presentation/components";
import React, { useEffect, useState } from "react";

type Props = {
  service: ServiceEntity;
  handleConfirmAddDays: (
    event: React.MouseEvent<HTMLButtonElement>,
    extraPriceUsd?: number
  ) => void;
};

export const ServiceItem = ({ service, handleConfirmAddDays }: Props) => {
  const [extraPriceUsd, setExtraPriceUsd] = useState<number>(0);
  
  useEffect(() => {
    setExtraPriceUsd(service.priceUsd?? 0);
  }, [service.priceUsd]);

  return (
    <Card key={service.id}>
      <h2 className="text-xl font-bold text-gray-800">{service.description}</h2>
      <Tag value={service.serviceType?.name} className="text-xs" />

      <div className="flex items-center space-x-6 mt-4 text-gray-600 text-sm">
        {service.duration && (
          <div className="flex items-center space-x-1">
            <i className="pi pi-clock" />
            <span>{service.duration}</span>
          </div>
        )}
        {service.passengersMin && (
          <div className="flex items-center space-x-1">
            <i className="pi pi-users" />
            <div className="flex gap-x-1">
              <span>{service.passengersMin}</span>
              {service.passengersMax && <>- {service.passengersMax}</>}
            </div>
          </div>
        )}
      </div>
      <div className="relative">
        <label className="block text-gray-700 font-semibold mb-1">
          Precio (USD)
        </label>
        <InputNumber
          value={service.priceUsd ?? 0}
          mode="currency"
          currency="USD"
          className="w-full"
          onChange={(e) => setExtraPriceUsd(e.value ?? service.priceUsd ?? 0)}
        />
        <p className="text-sm text-gray-500 mt-1">
          Precio base: {formatCurrency(service.priceUsd ?? 0)}
        </p>

        <Button
          icon="pi pi-plus"
          rounded
          className="absolute top-0 right-0 mt-7 "
          aria-label="Add"
          onClick={(e) => {
            handleConfirmAddDays(e, extraPriceUsd);
          }}
        />
      </div>
    </Card>
  );
};
