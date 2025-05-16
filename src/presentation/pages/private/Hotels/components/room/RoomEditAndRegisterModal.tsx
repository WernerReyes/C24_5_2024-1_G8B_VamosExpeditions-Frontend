/* import { HotelEntity } from "@/domain/entities"; */

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

//Import components
import {
  Button,
  Checkbox,
  DefaultFallBackComponent,
  Dialog,
  Dropdown,
  ErrorBoundary,
  InputNumber,
  InputText,
  /* InputText, */
} from "@/presentation/components";
import { RoomWithHotelInfo } from "./TableRoomActions";
import {
  useGetHotelsAllQuery,
  useUpsertRoomMutation,
} from "@/infraestructure/store/services";
import { roomDto, RoomDto } from "@/domain/dtos/room";

import Styles from "../Style.module.css";
import { HotelRoomType } from "@/domain/dtos/hotel";
import { useState } from "react";

type Props = {
  rowData: RoomWithHotelInfo;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const RoomEditAndRegisterModal = ({
  showModal,
  setShowModal,
  rowData,
}: Props) => {
  //useState
  const [checkHotel, setCheckHotel] = useState(true);

  //apis
  const {
    data: hotelsall,
    refetch: isRefetchHotelsAll,
    isLoading: isLoadingHotelsAll,
    isFetching: isFetchingHotelsAll,
    isError,
  } = useGetHotelsAllQuery();

  //Hook forms
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<RoomDto>({
    resolver: zodResolver(roomDto.getSchema),
    defaultValues: rowData?.id
      ? {
          roomId: rowData.id,
          type: HotelRoomType.ROOM,
          roomType: rowData.roomType,
          capacity: rowData.capacity,
          priceUsd: rowData.priceUsd,
          serviceTax: rowData.serviceTax,
          rateUsd: rowData.rateUsd,
          pricePen: rowData.pricePen,
          seasonType: rowData.seasonType,
          hotelId: rowData.hotels?.id,
        }
      : {
          roomId: undefined,
          roomType: "",
          type: HotelRoomType.ROOM,
          capacity: 1,
          priceUsd: 0,
          serviceTax: 0,
          rateUsd: 0,
          pricePen: 0,
          seasonType: "",
          hotelId: rowData.hotels?.id,
        },
  });

  const [upsertRoom, { isLoading }] = useUpsertRoomMutation();

  const handleUpsertRoom = async (data: RoomDto) => {
    upsertRoom(data)
      .unwrap()
      .then(() => {
        reset();
        
      });
  };

  return (
    <Dialog
      header={`${rowData.id ? "Editar" : "Registrar"} Habitación`}
      visible={showModal}
      style={{ height: "auto" }}
      className="sm:w-[60vw] w-full"
      onHide={() => setShowModal(false)}
    >
      <form
        className={Styles.form}
        onSubmit={handleSubmit(handleUpsertRoom)}
        noValidate
      >
        {/* ROOM */}
        <div>
          {/*  */}
          <div className={Styles.iconContainer}>
            <i
              className="pi pi-th-large text-2xl text-purple-500"
              style={{ fontSize: "1.5rem" }}
            />
            <h2 className="text-lg font-bold text-purple-500">
              Información de la Habitación
            </h2>
          </div>

          {/*  */}
          <div className={`${Styles.containerLine} border-purple-200`}>
            <div className={Styles.containerGrid}>
              <div>
                <Controller
                  control={control}
                  name="roomType"
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <InputText
                      label={{ text: "Tipo de Habitación" }}
                      placeholder="Tipo de Habitación"
                      id="roomType"
                      className="w-full"
                      invalid={!!error}
                      {...field}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold ",
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="capacity"
                  defaultValue={1}
                  render={({ field, fieldState: { error } }) => (
                    <InputNumber
                      {...field}
                      label={{ text: "Capacidad" }}
                      placeholder="Capacidad"
                      className="w-full"
                      id="capacity"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      onValueChange={(e) => {
                        field.onChange(e.value);
                      }}
                      min={1}
                      max={15}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <ErrorBoundary
                isLoader={isFetchingHotelsAll || isLoadingHotelsAll}
                fallBackComponent={
                  <>
                    <Controller
                      control={control}
                      name="hotelId"
                      defaultValue={undefined}
                      render={({ field, fieldState: { error } }) => {
                        
                        return (
                          <Dropdown
                            label={{ text: "Nombre del hotel" }}
                            placeholder="Nombre del hotel"
                            className="w-full"
                            filter
                            options={[]}
                            id="hotelId"
                            invalid={!!error}
                            optionLabel="name"
                            {...field}
                            small={{
                              text: error?.message,
                              className: "text-red-500 font-bold",
                            }}
                            dropdownIcon="pi pi-spin pi-spinner"
                            emptyMessage={
                              <DefaultFallBackComponent
                                refetch={isRefetchHotelsAll}
                                isFetching={isFetchingHotelsAll}
                                isLoading={isLoadingHotelsAll}
                                message="No se pudieron cargar los hoteles"
                              />
                            }
                          />
                        );
                      }}
                    />
                  </>
                }
                error={isError}
              >
                <Controller
                  control={control}
                  name="hotelId"
                  defaultValue={undefined}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <Dropdown
                        label={{ text: "Nombre del hotel" }}
                        placeholder="Nombre del hotel"
                        className="w-full"
                        filter
                        checkmark={true}
                        options={hotelsall?.data}
                        itemTemplate={(option) => {
                          return (
                            <div className="flex gap-2 items-center">
                              <i className="pi pi-building text-xl text-primary" />
                              {option.name}
                            </div>
                          );
                        }}
                        disabled={checkHotel}
                        id="hotelId"
                        optionValue="id"
                        invalid={!!error}
                        optionLabel="name"
                        {...field}
                        small={{
                          text: error?.message,
                          className: "text-red-500 font-bold",
                        }}
                      />
                    );
                  }}
                />
              </ErrorBoundary>
              <div className="flex justify-items-center mt-2">
                <Checkbox
                  inputId="checkHotel"
                  name="checkHotel"
                  loading={isLoadingHotelsAll}
                  value={checkHotel}
                  onChange={(e) => setCheckHotel(!!e.checked)}
                  label={{
                    text: "Bloquear selección de hotel",
                    htmlFor: "checkHotel",
                    className: "ml-2 !text-sm !font-semibold",
                  }}
                  checked={checkHotel}
                />
              </div>
            </div>

            <div>
              <Controller
                control={control}
                name="seasonType"
                defaultValue=""
                render={({ field, fieldState: { error } }) => (
                  <Dropdown
                    label={{ text: "Temporada" }}
                    placeholder="Temporada"
                    id="season"
                    className="w-full"
                    filter
                    options={[
                      { label: "Temporada 1", value: "1" },
                      { label: "Temporada 2", value: "2" },
                      { label: "Temporada 3", value: "3" },
                    ]}
                    invalid={!!error}
                    {...field}
                    small={{
                      text: error?.message,
                      className: "text-red-500 font-bold ",
                    }}
                  />
                )}
              />
            </div>

            <div className={Styles.containerGrid}>
              <div>
                <Controller
                  control={control}
                  name="priceUsd"
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <InputNumber
                      {...field}
                      label={{ text: "Precio (USD)" }}
                      placeholder="Precio (USD)"
                      className="w-full"
                      id="priceUsd"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      onValueChange={(e) => {
                        field.onChange(e.value);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="serviceTax"
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <InputNumber
                      {...field}
                      label={{ text: "Impuesto de Servicio (%)" }}
                      placeholder="Impuesto de Servicio (%)"
                      className="w-full"
                      id="serviceTax"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      onValueChange={(e) => {
                        field.onChange(e.value);
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div className={Styles.containerGrid}>
              <div>
                <Controller
                  control={control}
                  name="rateUsd"
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <InputNumber
                      {...field}
                      label={{ text: "Tarifa (USD)" }}
                      placeholder="Tarifa (USD)"
                      className="w-full"
                      id="rateUsd"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      onValueChange={(e) => {
                        field.onChange(e.value);
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="pricePen"
                  defaultValue={0}
                  render={({ field, fieldState: { error } }) => (
                    <InputNumber
                      {...field}
                      label={{ text: "Precio (PEN)" }}
                      placeholder="Precio (PEN)"
                      className="w-full"
                      id="pricePen"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                      onChange={(e) => {
                        field.onChange(e.value);
                      }}
                      onValueChange={(e) => {
                        field.onChange(e.value);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        {/* ROOM */}

        <div className="flex justify-end mt-3">
          <Button
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            disabled={!isDirty || isLoading}
            label={`${rowData.id ? "Editar" : "Registrar"} `}
          />
        </div>
      </form>
    </Dialog>
  );
};
