import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { RadioButtonChangeEvent } from "primereact/radiobutton";
import { DropdownChangeEvent } from "primereact/dropdown";
import {
  TreeSelectChangeEvent,
  TreeSelectSelectionKeysType,
} from "primereact/treeselect";

import {
  Button,
  Calendar,
  Dropdown,
  InputText,
  InputTextarea,
  RadioButton,
  TreeSelect,
} from "@/presentation/components";
import { useClientStore } from "@/infraestructure/hooks/useClientStore";
import { useEffect } from "react";
import {
  reservationDtoSchema,
  ReservationDto,
} from "@/domain/dtos/reservation";
import { useNationStore, useReservationStore } from "@/infraestructure/hooks";

import Style from "../Style.module.css";
import ReservationFormStyle from "./ReservationForm.module.css";

const travelClasses = [
  { key: "comfort", label: "Confort" },
  { key: "economy", label: "Económica" },
  { key: "firstClass", label: "Primera Clase" },
];

const codigo = [
  { name: "EtzyYYgS" },
  { name: "4I3ot8Vq" },
  { name: "BACYr45u" },
  { name: "pqPZc0FZ" },
  { name: "nMv4ZcdT" },
];

/*  */
export const ReservationForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    /* formState: { errors }, */
  } = useForm<ReservationDto>({
    resolver: zodResolver(reservationDtoSchema),
  });

  const { clients, startGetClients } = useClientStore();
  const { nations, getNations } = useNationStore();
  const { registerReservation } = useReservationStore();

  useEffect(() => {
    startGetClients();
    getNations();
  }, []);

  const handleReservation = (data: ReservationDto) => {
    registerReservation(
      data.clientId,
      data.numberOfPeople,
      data.travelDates,
      data.code,
      data.comfortClass,
      data.destination,
      data.specialSpecifications
    )
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const transformData = (cities: any) => {
    return cities.map((country: any) => ({
      key: country.code,
      label: country.name,
      selectable: false,
      children: country.cities.map((city: any) => ({
        key: city.id.toString(),
        label: city.name,
        selectable: true,
      })),
    }));
  };

  return (
    <form
      className={`${Style.form} flex-[2] `}
      onSubmit={handleSubmit(handleReservation)}
    >
      {/*  */}
      <div className={ReservationFormStyle.column}>
        {/*  */}
        <div className={Style.container}>
          <Controller
            control={control}
            name="clientId"
            render={({ field, fieldState: { error } }) => {
              return (
                <Dropdown
                  filter
                  options={clients.map((client) => ({
                    name: client.fullName,
                    id: client.id,
                  }))}
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
                  optionLabel="name"
                  optionValue="id"
                  onChange={(e: DropdownChangeEvent) => {
                    field.onChange(e.value);
                    console.log(e.value);
                  }}
                />
              );
            }}
          />
        </div>
        {/*  */}
        <div className={Style.container}>
          <Controller
            control={control}
            name="numberOfPeople"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={{
                  htmlFor: "Número de Personas",
                  text: "Número de Personas",
                }}
                type="number"
                small={{
                  text: error?.message,
                }}
                id="numberOfPeople"
                placeholder="Número de Personas"
                invalid={!!error}
                {...field}
                max={20}
                min={1}
              />
            )}
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
                  console.log(e.value);
                }}
                value={field.value as Date[]}
                small={{
                  text: error?.message,
                }}
                placeholder="Seleccione una fecha"
                selectionMode="range"
                readOnlyInput
                hideOnRangeSelection
              />
            )}
          />
        </div>
        <div className={Style.container}>
          <Controller
            control={control}
            name="code"
            render={({ field, fieldState: { error } }) => (
              <Dropdown
                filter
                options={codigo}
                label={{
                  text: "Código",
                  htmlFor: "codigo",
                }}
                small={{
                  text: error?.message,
                }}
                invalid={!!error}
                {...field}
                value={field.value}
                optionLabel="name"
                optionValue="name"
                placeholder="Código"
                onChange={(e: DropdownChangeEvent) => {
                  field.onChange(e.value);
                  console.log(e.value);
                }}
              />
            )}
          />
        </div>
      </div>
      <div className={ReservationFormStyle.confort}>
        <label>Clase de Confort</label>
        <div>
          <Controller
            control={control}
            name="comfortClass"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <>
                {travelClasses.map((travelClass) => (
                  <RadioButton
                    key={travelClass.key}
                    label={{
                      text: travelClass.label,
                      htmlFor: travelClass.label,
                      className: "ml-2",
                    }}
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

      <div className={Style.container}>
        <Controller
          control={control}
          name="destination"
          render={({ field, fieldState: { error } }) => (
            <TreeSelect
              className="w-full"
              options={transformData(nations)}
              selectionMode="multiple"
              showClear
              filter
              placeholder="Seleccione una ciudad"
              label={{
                text: "Destino",
                htmlFor: "destino",
              }}
              {...field}
              value={field.value as unknown as TreeSelectSelectionKeysType}
              onChange={(e: TreeSelectChangeEvent) => {
                console.log(e.value);
                field.onChange(e.value);
              }}
              small={{
                text: error?.message,
              }}
            />
          )}
        />
      </div>

      <div className={Style.container}>
        <Controller
          control={control}
          name="specialSpecifications"
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <InputTextarea
              rows={5}
              cols={30}
              label={{
                text: "Comentarios",
                htmlFor: "comentarios",
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

      <Button icon="pi pi-save" label="Guardar" />
    </form>
  );
};
