import { type MouseEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Calendar,
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
import { reservationDto, type ReservationDto } from "@/domain/dtos/reservation";

import ReservationFormStyle from "./ReservationForm.module.css";
import { OrderType, ReservationStatus, TravelerStyle } from "@/domain/entities";
import { generateCode, transformDataToTree } from "../../utils";

import Style from "../Style.module.css";
import {
  useGetAllClientsQuery,
  useGetCountriesQuery,
  useUpdateVersionQuotationMutation,
  useUpsertReservationMutation,
} from "@/infraestructure/store/services";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import {
  onSetCurrentReservation,
  onSetSelectedClient,
} from "@/infraestructure/store";
import { versionQuotationDto } from "@/domain/dtos/versionQuotation";

const TRAVELER_CLASES = [
  { key: TravelerStyle.COMFORT, label: "Confort" },
  { key: TravelerStyle.LUXUS, label: "Lujo" },
  { key: TravelerStyle.STANDARD, label: "Estándar" },
];

export const ReservationForm = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ReservationDto>({
    resolver: zodResolver(reservationDto.getSchema),
    defaultValues: reservationDto.getEmpty,
  });

  const { currentVersionQuotation } = useSelector(
    (state: AppState) => state.versionQuotation
  );

  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );

  const [updateVersionQuotation] = useUpdateVersionQuotationMutation();

  const [upsertReservation, { isLoading: isUpsertingReservation }] =
    useUpsertReservationMutation();
  const { data: clients, isLoading: isGettingAllClients } =
    useGetAllClientsQuery();

  const {
    data: countries,
    isLoading: isGettingCountries,
    isError: isGettingCountriesError,
    isFetching: isFetchingCountries,
    refetch: refetchingCountries,
  } = useGetCountriesQuery();

  const [isContentLoading, setIsContentLoading] = useState(true);

  const handleReservation = (reservationDto: ReservationDto) => {
    upsertReservation({
      reservationDto: {
        ...reservationDto,
        status: ReservationStatus.ACTIVE,
      },
    })
      .unwrap()
      .then(({ data }) => {
        if (reservationDto.id) return;
        updateVersionQuotation(
          versionQuotationDto.parse({
            ...currentVersionQuotation!,
            reservation: data,
          })
        )
          .unwrap()
          .then(() => {
            dispatch(onSetCurrentReservation(data));
          });
      });
  };

  const handleCancelReservation = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!currentVersionQuotation) return;
    updateVersionQuotation(
      versionQuotationDto.parse({
        ...currentVersionQuotation,
        reservation: undefined,
      })
    )
      .unwrap()
      .then(async () => {
        await upsertReservation({
          reservationDto: reservationDto.parse({
            ...currentReservation!,
            status: ReservationStatus.PENDING,
          }),
          showMessage: false,
        });
        dispatch(onSetCurrentReservation(null));
        reset(reservationDto.getEmpty);
        dispatch(onSetSelectedClient(null));
      });
  };

  useEffect(() => {
    if (currentReservation) {
      reset(reservationDto.parse(currentReservation));
      if (currentReservation.client) {
        dispatch(onSetSelectedClient(currentReservation.client));
      }
    }

    setIsContentLoading(false);
  }, [currentReservation]);

  useEffect(() => {
    const code = generateCode({
      subregion: watch("client.subregion"),
      orderType: watch("orderType"),
      startDate: watch("travelDates") && watch("travelDates")[0],
      travelerStyle: watch("travelerStyle"),
      travelersAmount: watch("numberOfPeople"),
    });
    setValue("code", code);
  }, [
    watch().client,
    watch().orderType,
    watch().travelDates,
    watch().travelerStyle,
    watch().numberOfPeople,
  ]);

  return (
    <form className={Style.form} onSubmit={handleSubmit(handleReservation)}>
      {/*  */}
      <div className={ReservationFormStyle.column}>
        {/*  */}
        <div className={Style.container}>
          <Controller
            control={control}
            name="client"
            defaultValue={undefined}
            render={({ field, fieldState: { error } }) => {
              return (
                <Dropdown
                  loading={isContentLoading || isGettingAllClients}
                  filter
                  options={clients?.data}
                  label={{
                    text: "Cliente",
                    htmlFor: "client",
                  }}
                  placeholder="Escoge un cliente"
                  small={{
                    text: error?.message,
                  }}
                  value={field.value}
                  invalid={!!error}
                  optionLabel="fullName"
                  onChange={(e: DropdownChangeEvent) => {
                    field.onChange(e.value);
                    dispatch(onSetSelectedClient(e.value));
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
      <div className={ReservationFormStyle.column}>
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
                  isContentLoading ? "pi pi-spin pi-spinner" : "pi pi-calendar"
                }
                hideOnRangeSelection
                showIcon
              />
            )}
          />
        </div>
        <div className={Style.container}>
          <ErrorBoundary
            isLoader={isGettingCountries}
            loadingComponent={
              <div className="font-bold flex flex-col gap-2 mb-5">
                <InputText
                  label={{
                    text: "Destino",
                    htmlFor: "destino",
                  }}
                  loading={isFetchingCountries}
                  skeleton={{
                    height: "4rem",
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
                    options={transformDataToTree(countries?.data || [])}
                    selectionMode="multiple"
                    showClear
                    filter
                    // className="bg-green-200"
                    // panelClassName="w-10"
                    pt={{
                      labelContainer: { className: "w-10" }
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
        <div className={ReservationFormStyle.confort}>
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
        <div className={ReservationFormStyle.confort}>
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

      <div className="flex flex-col gap-y-4 sm:justify-between sm:flex-row">
        <Button
          icon={currentReservation ? "pi pi-pencil" : "pi pi-plus"}
          disabled={
            isContentLoading ||
            isUpsertingReservation ||
            Object.keys(errors).length > 0 ||
            !isDirty
          }
          label={currentReservation ? "Actualizar Reserva" : "Crear Reserva"}
          loading={isContentLoading || isUpsertingReservation}
        />
        {currentReservation && (
          <Button
            icon="pi pi-times"
            className="bg-primary"
            label="Cancelar Edición"
            disabled={isUpsertingReservation || isContentLoading}
            onClick={handleCancelReservation}
          />
        )}
      </div>
    </form>
  );
};
