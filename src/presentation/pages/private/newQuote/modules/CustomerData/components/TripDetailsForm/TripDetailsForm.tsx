import {
  Button,
  Calendar,
  ConfirmDialog,
  DefaultFallBackComponent,
  Dropdown,
  type DropdownChangeEvent,
  ErrorBoundary,
  InputNumber,
  InputText,
  InputTextarea,
  RadioButton,
  type RadioButtonChangeEvent,
  TreeSelect,
  type TreeSelectChangeEvent,
  type TreeSelectSelectionKeysType,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  type HotelRoomTripDetailsEntity,
  OrderType,
  TravelerStyle,
} from "@/domain/entities";
import { generateCode } from "../../utils";

import type { AppState } from "@/app/store";
import { dateFnsAdapter } from "@/core/adapters";
import { tripDetailsDto, type TripDetailsDto } from "@/domain/dtos/tripDetails";
import { onSetSelectedClient } from "@/infraestructure/store";
import {
  useDeleteManyHotelRoomTripDetailsMutation,
  useGetAllClientsQuery,
  useGetCountriesQuery,
  useUpsertTripDetailsMutation,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import Style from "../Style.module.css";
import TripDetailsFormStyle from "./TripDetailsForm.module.css";
import { ClientInfo } from "@/presentation/pages/private/components";

const TRAVELER_CLASES = [
  { key: TravelerStyle.COMFORT, label: "Confort" },
  { key: TravelerStyle.LUXUS, label: "Lujo" },
  { key: TravelerStyle.STANDARD, label: "Estándar" },
];

export const TripDetailsForm = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<TripDetailsDto>({
    resolver: zodResolver(tripDetailsDto.getSchema),
    defaultValues: tripDetailsDto.getEmpty,
  });

  const { hotelRoomTripDetails } = useSelector(
    (state: AppState) => state.hotelRoomTripDetails
  );

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const { selectedClient } = useSelector((state: AppState) => state.client);

  const [upsertTripDetails, { isLoading: isUpsertingTripDetails }] =
    useUpsertTripDetailsMutation();
  const { data: clients, isLoading: isGettingAllClients } =
    useGetAllClientsQuery();

  const [deleteManyHotelRoomTripDetails] =
    useDeleteManyHotelRoomTripDetailsMutation();

  const {
    data: countries,
    isLoading: isGettingCountries,
    isError: isGettingCountriesError,
    isFetching: isFetchingCountries,
    refetch: refetchingCountries,
  } = useGetCountriesQuery();
  const [
    hotelsQuotationsOutSideDateRange,
    setHotelsQuotationsOutSideDateRange,
  ] = useState<HotelRoomTripDetailsEntity[]>([]);
  const [visible, setVisible] = useState(false);
  const [accept, setAccept] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [deleteByDestination, setDeleteByDestination] = useState(false);

  const handleTripDetails = async (
    tripDetailsDto: TripDetailsDto,
    accept?: boolean
  ) => {
    const daysToDelete = !accept
      ? hotelRoomTripDetails.filter((quote) => {
          const cityId = quote?.hotelRoom?.hotel?.distrit?.city?.id;
          if (!tripDetailsDto.destination[cityId!]) {
            setDeleteByDestination(true);
            return !Object.keys(tripDetailsDto.destination).includes(
              cityId!.toString()
            );
          }
          return !dateFnsAdapter.isWithinInterval(
            quote.date,
            tripDetailsDto.travelDates[0],
            tripDetailsDto.travelDates[1]
          );
        })
      : [];
      
    if (daysToDelete.length > 0) {
      setVisible(true);
      setHotelsQuotationsOutSideDateRange(daysToDelete);
      return;
    }
    await upsertTripDetails({
      tripDetailsDto,
    });
  };

  useEffect(() => {
    if (accept && hotelsQuotationsOutSideDateRange.length > 0) {
      deleteManyHotelRoomTripDetails(
        hotelsQuotationsOutSideDateRange.map((quote) => quote.id)
      ).then(() => {
        handleSubmit((data) => {
          handleTripDetails(data, true);
        })();
        setAccept(false);
        setVisible(false);
        setDeleteByDestination(false);
      });
    }
  }, [accept]);

  useEffect(() => {
    if (currentTripDetails?.id) {
      reset(tripDetailsDto.parse(currentTripDetails));
    }
    dispatch(onSetSelectedClient(currentTripDetails?.client ?? null));

    setIsContentLoading(false);
  }, [currentTripDetails]);

  useEffect(() => {
    if (currentVersionQuotation) {
      setValue("versionQuotationId", currentVersionQuotation.id);
    }
  }, [currentVersionQuotation]);

  useEffect(() => {
    const code = generateCode({
      subregion: selectedClient?.subregion,
      orderType: watch("orderType"),
      startDate: watch("travelDates") && watch("travelDates")[0],
      travelerStyle: watch("travelerStyle"),
      travelersAmount: watch("numberOfPeople"),
    });
    setValue("code", code);
  }, [
    selectedClient,
    watch().clientId,
    watch().orderType,
    watch().travelDates,
    watch().travelerStyle,
    watch().numberOfPeople,
  ]);

  return (
    <>
      <ConfirmDialog
        group="declarative"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        acceptLabel="Sí"
        visible={visible}
        className="max-w-lg"
        message={
          deleteByDestination
            ? "¿Estás seguro de cambiar el destino de la reserva?, se eliminarán los días que no pertenezcan a la ciudad seleccionada."
            : "¿Estás seguro de cambiar la fecha de la reserva?, se eliminarán los días que no estén dentro del rango de fechas."
        }
        onHide={() => setVisible(false)}
        accept={() => setAccept(true)}
        reject={() => setAccept(false)}
      />
      <form
        className={Style.form}
        onSubmit={handleSubmit((data) => handleTripDetails(data))}
      >
        {/*  */}
        <div className={TripDetailsFormStyle.column}>
          {/*  */}
          <div className={Style.container}>
            <Controller
              control={control}
              name="clientId"
              defaultValue={selectedClient?.id}
              render={({ field, fieldState: { error } }) => {
                return (
                  <Dropdown
                    loading={isContentLoading || isGettingAllClients}
                    filter
                    options={clients?.data || []}
                    label={{
                      text: "Cliente",
                      htmlFor: "client",
                    }}
                    placeholder="Escoge un cliente"
                    small={{
                      text: error?.message,
                    }}
                    itemTemplate={(option) => {
                      return <ClientInfo client={option} />;
                    }}
                    value={field.value}
                    invalid={!!error}
                    optionLabel="fullName"
                    optionValue="id"
                    onChange={(e: DropdownChangeEvent) => {
                      field.onChange(e.value);
                      const selectedClient = clients?.data.find(
                        (client) => client.id === Number(e.value)
                      );
                      if (selectedClient) {
                        dispatch(onSetSelectedClient(selectedClient));
                      }
                    }}
                  />
                );
              }}
            />
          </div>

          <div className={Style.container}>
            <Controller
              control={control}
              name="numberOfPeople"
              defaultValue={1}
              render={({ field, fieldState: { error } }) => {
                return (
                  <InputNumber
                    label={{
                      htmlFor: "Número de Personas",
                      text: "Nro. Personas",
                    }}
                    small={{
                      text: error?.message,
                    }}
                    inputClassName="w-full"
                    loading={isContentLoading}
                    id="numberOfPeople"
                    placeholder="Nro. Personas"
                    invalid={!!error}
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e.value);
                    }}
                    onValueChange={(e) => {
                      field.onChange(e.value);
                    }}
                    min={1}
                    max={15}
                  />
                );
              }}
            />
          </div>

          {/*  */}
        </div>
        {/*  */}
        <div className={TripDetailsFormStyle.column}>
          <div className={Style.container}>
            <Controller
              control={control}
              name="travelDates"
              render={({ field, fieldState: { error } }) => (
                <Calendar
                  numberOfMonths={2}
                  label={{
                    text: "Fecha",
                    htmlFor: "calendar",
                  }}
                  onChange={(e) => {
                    field.onChange(e.value);
                  }}
                  value={field.value as Date[]}
                  small={{
                    text: error?.message,
                  }}
                  invalid={!!error}
                  loading={isContentLoading}
                  locale="es"
                  dateFormat="dd/mm/yy"
                  placeholder="Seleccione una fecha"
                  selectionMode="range"
                  inputClassName="w-full"
                  readOnlyInput
                  icon={
                    isContentLoading
                      ? "pi pi-spin pi-spinner"
                      : "pi pi-calendar"
                  }
                  hideOnRangeSelection
                  showIcon
                />
              )}
            />
          </div>
          <div className={Style.container}>
            <ErrorBoundary
              isLoader={isGettingCountries || isFetchingCountries}
              loadingComponent={
                <div className="font-bold flex flex-col gap-2 mb-5">
                  <InputText
                    label={{
                      text: "Destino",
                      htmlFor: "destino",
                    }}
                    loading={isFetchingCountries}
                    skeleton={{
                      height: "3rem",
                    }}
                    disabled
                    id="destino"
                    placeholder="Destino"
                  />
                </div>
              }
              fallBackComponent={
                <div className="mb-5">
                  <label className="font-bold text-gray-700" htmlFor="destino">
                    Destino
                  </label>
                  <DefaultFallBackComponent
                    refetch={refetchingCountries}
                    isFetching={isFetchingCountries}
                    isLoading={isGettingCountries}
                    message="No se pudo cargar la lista de destinos"
                  />
                </div>
              }
              error={isGettingCountriesError}
            >
              <Controller
                control={control}
                name="destination"
                render={({ field, fieldState: { error } }) => {
                  return (
                    <TreeSelect
                      options={
                        countries?.data.map((country) => ({
                          key: country.code,
                          label: country.name,
                          icon: country.image ? (
                            <img
                              src={country.image?.svg}
                              className="w-5 me-2"
                              alt={country.name}
                            />
                          ) : undefined,
                          selectable: false,
                          children: country.cities?.map((city) => ({
                            key: city?.id.toString(),
                            label: city.name,
                            selectable: true,
                          })),
                        })) || []
                      }
                      selectionMode="multiple"
                      showClear
                      filter
                      pt={{
                        labelContainer: { className: "w-10" },
                      }}
                      placeholder="Seleccione una ciudad"
                      label={{
                        text: "Destino",
                        htmlFor: "destino",
                      }}
                      invalid={!!error}
                      value={
                        field.value as unknown as TreeSelectSelectionKeysType
                      }
                      onChange={(e: TreeSelectChangeEvent) => {
                        field.onChange(e.value);
                      }}
                      small={{
                        text: error?.message,
                      }}
                    />
                  );
                }}
              />
            </ErrorBoundary>
          </div>
        </div>
        <div className="flex justify-between">
          <div className={TripDetailsFormStyle.confort}>
            <label>Elegir Clase</label>
            <div>
              <Controller
                control={control}
                name="travelerStyle"
                defaultValue={TravelerStyle.COMFORT}
                render={({ field, fieldState: { error } }) => (
                  <>
                    {TRAVELER_CLASES.map((travelClass) => (
                      <RadioButton
                        key={travelClass.key}
                        label={{
                          text: travelClass.label,
                          htmlFor: travelClass.label,
                          className: "ml-2",
                        }}
                        loading={isContentLoading}
                        invalid={!!error}
                        {...field}
                        onChange={(e: RadioButtonChangeEvent) => {
                          field.onChange(e.value);
                        }}
                        value={travelClass.key}
                        name="comfortClass"
                        checked={field.value === travelClass.key}
                      />
                    ))}
                    {error && <small>{error.message}</small>}
                  </>
                )}
              />
            </div>
          </div>
          <div className={TripDetailsFormStyle.confort}>
            <label>Tipo de Pedido</label>
            <div>
              <Controller
                control={control}
                name="orderType"
                defaultValue={OrderType.DIRECT}
                render={({ field, fieldState: { error } }) => (
                  <>
                    {[
                      { key: OrderType.DIRECT, label: "Directa" },
                      { key: OrderType.INDIRECT, label: "Indirecta" },
                    ].map((order) => (
                      <RadioButton
                        key={order.key}
                        label={{
                          text: order.label,
                          htmlFor: order.label,
                          className: "ml-2",
                        }}
                        loading={isContentLoading}
                        invalid={!!error}
                        {...field}
                        onChange={(e: RadioButtonChangeEvent) => {
                          field.onChange(e.value);
                        }}
                        value={order.key}
                        name="orderType"
                        checked={field.value === order.key}
                      />
                    ))}
                    {error && <small>{error.message}</small>}
                  </>
                )}
              />
            </div>
          </div>
        </div>

        <div className={Style.container + " mt-3"}>
          <Controller
            control={control}
            name="code"
            defaultValue=""
            render={({ field, fieldState: { error } }) => {
              return (
                <InputText
                  label={{
                    text: "Código",
                    htmlFor: "codigo",
                  }}
                  loading={isContentLoading}
                  small={{
                    text: error?.message,
                  }}
                  id="code"
                  invalid={!!error}
                  {...field}
                  placeholder="Código"
                  disabled
                />
              );
            }}
          />
        </div>

        <div className={Style.container}>
          <Controller
            control={control}
            name="specialSpecifications"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputTextarea
                rows={4}
                cols={20}
                label={{
                  text: "Comentarios",
                  htmlFor: "comentarios",
                }}
                loading={isContentLoading}
                skeleton={{
                  height: "7rem",
                }}
                small={{
                  text: error?.message,
                }}
                id="specialSpecifications"
                invalid={!!error}
                {...field}
                placeholder="Comentarios"
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="id"
          defaultValue={0}
          render={({ field }) => {
            return <input type="hidden" id="id" {...field} />;
          }}
        />

        <div className="flex flex-col gap-y-4 sm:justify-start sm:flex-row">
          <Button
            icon={currentTripDetails ? "pi pi-pencil" : "pi pi-plus"}
            disabled={
              isContentLoading ||
              isUpsertingTripDetails ||
              Object.keys(errors).length > 0 ||
              !isDirty
            }
            label={
              currentTripDetails
                ? "Actualizar Detalles del Viaje"
                : "Crear Detalles del Viaje"
            }
            loading={isContentLoading || isUpsertingTripDetails}
          />
        </div>
      </form>
    </>
  );
};
