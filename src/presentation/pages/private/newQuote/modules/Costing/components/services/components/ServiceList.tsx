import type { AppState } from "@/app/store";
import { cn } from "@/core/adapters";
import { formatCurrency } from "@/core/utils";
import type { ServiceEntity, ServiceTypeEntity } from "@/domain/entities";
import {
  useCreateManyServiceTripDetailsMutation,
  useGetServicesQuery,
  useGetServiceTypesQuery,
} from "@/infraestructure/store/services";
import {
  Button,
  Card,
  confirmPopup,
  DataView,
  Dialog,
  Dropdown,
  InputNumber,
  Tag,
} from "@/presentation/components";
import { usePaginator } from "@/presentation/hooks";
import { DaysNumberToAdd } from "@/presentation/pages/private/newQuote/modules/components";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

const ROWS_PER_PAGE = [10, 20, 30];

export const ServiceList = ({ visible, setVisible }: Props) => {
  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );
  const { selectedCity, days } = useSelector(
    (state: AppState) => state.quotation
  );
  const { currentPage, first, limit, handlePageChange } = usePaginator(
    ROWS_PER_PAGE[0]
  );
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(
    undefined
  );

  const [createManyServiceTripDetails] =
    useCreateManyServiceTripDetailsMutation();

  const geAllServices = useGetServicesQuery(
    {
      page: currentPage,
      limit: limit,
      cityId: selectedCity?.id,
      // districtId: 1,
      serviceTypeId: activeCategoryId,
      select: {
        id: true,
        description: true,
        service_type: {
          name: true,
        },
        duration: true,
        passengers_min: true,
        passengers_max: true,
        price_usd: true,
      },
    },
    {
      skip: !selectedCity,
    }
  );

  const getAllServiceTypes = useGetServiceTypesQuery({
    page: 1,
    limit: 100,
    select: {
      id: true,
      name: true,
      service: [
        {
          id: true,
        },
      ],
    },
  }, {
    skip:!selectedCity,
  });

  const serviceTypes = getAllServiceTypes.data?.data;

  const services = geAllServices.data?.data;

  const [rangeState, setRangeState] = useState<[number, number]>([1, 1]);
  const [autoCompleteDay, setAutoCompleteDay] = useState(true);
  const [confirm, setConfirm] = useState(false);

  const [selectedService, setSelectedService] = useState<ServiceEntity>();

  const [extraPriceUsd, setExtraPriceUsd] = useState<{
    [key: number]: number;
  }>();

  const handleConfirmAddDays = (event: React.MouseEvent<HTMLButtonElement>) => {
    confirmPopup({
      target: event.currentTarget,
      message: (
        <DaysNumberToAdd
          setRange={setRangeState}
          setAutoCompleteDay={setAutoCompleteDay}
        />
      ),
      acceptClassName: cn(),
      defaultFocus: "accept",
      acceptLabel: "Aceptar",
      rejectLabel: "Cancelar",
      accept: () => {
        setConfirm(true);
      },
    });
  };

  const handleAddServiceDetails = async (service: ServiceEntity) => {
    setConfirm(false);
    if (extraPriceUsd?.[service.id] && extraPriceUsd?.[service.id] === 0)
      return;
    if (!service.priceUsd && !extraPriceUsd?.[service.id]) return;

    const dateRange = (): [Date, Date] => {
      const startDate = days[rangeState[0] - 1];
      const endDate = days?.[rangeState[1] - 1] ?? days[rangeState[0] - 1];
      return [startDate.date, endDate.date];
    };

    await createManyServiceTripDetails({
      tripDetailsId: currentTripDetails!.id,
      dateRange: dateRange(),
      countPerDay: autoCompleteDay
        ? Math.floor(
            currentTripDetails!.numberOfPeople /
              (service.passengersMax
                ? service.passengersMax
                : service.passengersMin
                ? service.passengersMin
                : 1)
          )
        : 1,
      id: service.id,
      costPerson: extraPriceUsd?.[service.id] ?? service.priceUsd!, // TODO: For now, we use the rateUsd as the priceUsd
    })
      .unwrap()
      .then(() => {
        setVisible(false);
      })
      .finally(() => {
        setConfirm(false);
        setExtraPriceUsd(undefined)
      });
    // setConfirm(false);
    // setSelectedService(undefined);
  };


  useEffect(() => {
    if (!confirm || !selectedService) return;

    handleAddServiceDetails(selectedService);
  }, [confirm]);

  return (
    <Dialog
      header="Servicios"
      visible={visible}
      onHide={() => setVisible(false)}
    >
      <DataView
        value={services?.content}
        paginator
        rows={limit}
        first={first}
        lazy
        onPage={handlePageChange}
        loading={geAllServices.isLoading}
        paginatorPosition="both"
        totalRecords={services?.total}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={ROWS_PER_PAGE}
        pt={{
          grid: {
            className: "grid sm:grid-cols-2 gap-5 xl:grid-cols-3 items-start",
          },
        }}
        header={
          <Dropdown
            value={activeCategoryId}
            options={serviceTypes?.content ?? []}
            editable
            optionValue="id"
            optionLabel="name"
            showClear
            loading={getAllServiceTypes.isLoading}
            itemTemplate={(option: ServiceTypeEntity) => (
              <div className="flex space-x-1">
                <span className="font-semibold">{option.name}</span>
                <span className="font-semibold">|</span>
                <span className="text-sm opacity-70">
                  {option?.services?.length} servicios
                </span>
              </div>
            )}
            onChange={(e) => setActiveCategoryId(e.value)}
            placeholder="Seleccione un tipo de servicio"
            className="w-full"
          />
        }
        listTemplate={(services: ServiceEntity[]) => (
          <div
            className={cn(
              services.length > 0
                ? "grid sm:grid-cols-2 gap-5 xl:grid-cols-3 items-start"
                : "col-span-2 flex items-center justify-center h-72"
            )}
          >
            {services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id}>
                  <h2 className="text-xl font-bold text-gray-800">
                    {service.description}
                  </h2>
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
                          {service.passengersMax && (
                            <>- {service.passengersMax}</>
                          )}
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
                      inputClassName="w-full"
                      onChange={(e) => {
                        setExtraPriceUsd({
                          ...extraPriceUsd,
                          [service.id]: e.value ?? service.priceUsd ?? 0,
                        });
                      }}
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
                        setSelectedService(service);
                        handleConfirmAddDays(e);
                      }}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <h3 className="text-lg font-semibold text-slate-500">
                No se encontraron servicios
              </h3>
            )}
          </div>
        )}
      />
    </Dialog>
  );
};
