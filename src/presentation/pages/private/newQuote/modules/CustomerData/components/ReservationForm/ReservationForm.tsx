import { type MouseEvent, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Calendar,
  Dropdown,
  type DropdownChangeEvent,
  InputNumber,
  InputText,
  InputTextarea,
  RadioButton,
  type RadioButtonChangeEvent,
  TreeSelect,
  type TreeSelectChangeEvent,
  type TreeSelectSelectionKeysType,
} from "@/presentation/components";
import { useClientStore } from "@/infraestructure/hooks/useClientStore";
import {
  reservationDtoEmpty,
  reservationDtoSchema,
  type ReservationDto,
} from "@/domain/dtos/reservation";
import { useCountryStore, useReservationStore } from "@/infraestructure/hooks";

import ReservationFormStyle from "./ReservationForm.module.css";
import { OrderType, TravelerStyle } from "@/domain/entities";
import { generateCode, transformDataToTree } from "../../utils";

import Style from "../Style.module.css";


const TRAVELER_CLASES = [
  { key: TravelerStyle.COMFORT, label: "Confort" },
  { key: TravelerStyle.LUXUS, label: "Lujo" },
  { key: TravelerStyle.STANDARD, label: "Estándar" },
];

export const ReservationForm = () => {
  const { control, handleSubmit, reset, watch, setValue } =
    useForm<ReservationDto>({
      resolver: zodResolver(reservationDtoSchema),
    });
  const {
    startCreatingReservation,
    startUpdatingReservation,
    startDeletingReservation,
    currentReservation,
    createReservationResult: { isLoading: isCreatingReservation },
    updateReservationResult: { isLoading: isUpdatingReservation },
  } = useReservationStore();
  const {
    clients,
    startGettingAllClients,
    startSelectingClient,
    getAllClientsResult: { isGettingAllClients },
  } = useClientStore();
  const { countries, startGettingCountries } = useCountryStore();
  const [isContentLoading, setIsContentLoading] = useState(true);

  const handleReservation = (reservationDto: ReservationDto) => {
    if (currentReservation) {
      startUpdatingReservation(currentReservation.id, reservationDto);
      return;
    }
    startCreatingReservation(reservationDto);
  };

  const handleCancelReservation = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startDeletingReservation(currentReservation!.id);
    reset(reservationDtoEmpty);
    startSelectingClient(null);
  };

  useEffect(() => {
    startGettingAllClients();
    startGettingCountries();
  }, []);

  useEffect(() => {
    if (currentReservation) {
      const {
        client,
        numberOfPeople,
        startDate,
        endDate,
        code,
        cities,
        orderType,
        travelerStyle,
        specialSpecifications,
      } = currentReservation;
      reset({
        client,
        numberOfPeople,
        travelDates: [startDate, endDate],
        code,
        travelerStyle,
        orderType,
        destination: cities?.reduce(
          (acc, city) => ({ ...acc, [city.id]: true }),
          {}
        ),
        specialSpecifications: specialSpecifications ?? "",
      });
    }

    if (currentReservation?.client) {
      startSelectingClient(currentReservation.client);
    }

    setIsContentLoading(false);
  }, [currentReservation]);

  useEffect(() => {
    const code = generateCode({
      continent: watch("client.continent"),
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
    <form
      className={`${Style.form} flex-[2]`}
      onSubmit={handleSubmit(handleReservation)}
    >
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
                  options={clients}
                  label={{
                    text: "Nombre del cliente",
                    htmlFor: "client",
                  }}
                  placeholder="Nombre del cliente"
                  small={{
                    text: error?.message,
                  }}
                  invalid={!!error}
                  {...field}
                  value={field.value}
                  optionLabel="fullName"
                  onChange={(e: DropdownChangeEvent) => {
                    field.onChange(e.value);
                    startSelectingClient(e.value);
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
                    text: "Número de Personas",
                  }}
                  small={{
                    text: error?.message,
                  }}
                  loading={isContentLoading}
                  id="numberOfPeople"
                  placeholder="Número de Personas"
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
          <Controller
            control={control}
            name="destination"
            render={({ field, fieldState: { error } }) => (
              <TreeSelect
                options={transformDataToTree(countries)}
                selectionMode="multiple"
                showClear
                filter
                placeholder="Seleccione una ciudad"
                label={{
                  text: "Destino",
                  htmlFor: "destino",
                }}
                loading={isContentLoading}
                {...field}
                invalid={!!error}
                value={field.value as unknown as TreeSelectSelectionKeysType}
                onChange={(e: TreeSelectChangeEvent) => {
                  field.onChange(e.value);
                }}
                small={{
                  text: error?.message,
                }}
              />
            )}
          />
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

      <div className="flex justify-between">
        <Button
          icon={currentReservation ? "pi pi-pencil" : "pi pi-plus"}
          disabled={
            isContentLoading || isCreatingReservation || isUpdatingReservation
          }
          label={currentReservation ? "Actualizar Reserva" : "Crear Reserva"}
          loading={
            isContentLoading || isCreatingReservation || isUpdatingReservation
          }
        />
        {currentReservation && (
          <Button
            icon="pi pi-times"
            className="bg-primary"
            label="Cancelar Edición"
            disabled={
              isCreatingReservation || isUpdatingReservation || isContentLoading
            }
            onClick={handleCancelReservation}
          />
        )}
      </div>
    </form>
  );
};
