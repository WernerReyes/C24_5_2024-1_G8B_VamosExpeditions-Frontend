import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import {
  Button,
  Dialog,
  InputText,
  Dropdown,
  SplitButton,
  MenuItem,
} from "@/presentation/components";

import { useState } from "react";

import Styles from "./Style.module.css";

import {
  HotelRoomDtoUnion,
  HotelRoomType,
  registerDto,
} from "../../../../../domain/dtos/hotel/Hotel.dto";
import { useRegisterHotelandRoomMutation } from "@/infraestructure/store/services";

export const NewHotelDialog = () => {
  const [visible, setVisible] = useState(false);
  const [registerHotelandRoom, { isLoading:isLoadingHotelandRoom  }] = useRegisterHotelandRoomMutation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<HotelRoomDtoUnion>({
    resolver: zodResolver(registerDto.getSchema),
  });

  const handleSave = (type: HotelRoomDtoUnion["type"]) => {
    setValue("type", type);
    handleSubmit(async (data) => {
      try {
        await registerHotelandRoom(data).unwrap();
        
        
      } catch (error) {
        console.error("Error al guardar:", error);
      }
    })();
  };

  const OPERATIONS: MenuItem[] = [
    {
      label: "Guardar Hotel",
      icon: "pi pi-building",
      command: () => handleSave(HotelRoomType.HOTEL),
    },
    {
      label: "Guardar Habitación",
      icon: "pi pi-warehouse",
      command: () => handleSave(HotelRoomType.ROOM),
    },
    {
      label: "Guardar Todo",
      icon: "pi pi-check",
      command: () => handleSave(HotelRoomType.HOTELANDROOM),
    },

    {
      label: "Cancelar",
      icon: "pi pi-times",
      command: () => {
        setVisible(false);
      },
    },
  ];

  return (
    <>
      <Dialog
        header={
          <>
            <h1>Registro de Hotel y Habitación</h1>
          </>
        }
        visible={visible}
        onHide={() => {
          setVisible(false);
        }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        style={{ height: "auto" }}
      >
        <form className={Styles.form}>
          {/* HOTEL */}

          <div>
            {/*  */}
            <div className={Styles.iconContainer}>
              <i
                className="pi pi-building text-2xl text-teal-500"
                style={{ fontSize: "1.5rem" }}
              />

              <h2 className="text-lg font-bold text-teal-500">
                Información del Hotel
              </h2>
            </div>
            {/*  */}
            <div className={`${Styles.containerLine} border-teal-200`}>
              <div className={Styles.containerGrid}>
                <div>
                  <Controller
                    control={control}
                    name="category"
                    defaultValue={undefined}
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        label={{ text: "Categoria" }}
                        placeholder="Nombre del categoria"
                        id="category"
                        className="w-full"
                        filter
                        options={[
                          { label: "Categoria 1", value: "1" },
                          { label: "Categoria 2", value: "2" },
                          { label: "Categoria 3", value: "3" },
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
                <div>
                  <Controller
                    control={control}
                    name="name"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <InputText
                        label={{ text: "Nombre del Hotel" }}
                        placeholder="Nombre del hotel"
                        className="w-full"
                        id="name"
                        invalid={!!error}
                        {...field}
                        small={{
                          text: error?.message,
                          className: "text-red-500 font-bold",
                        }}
                      />
                    )}
                  />
                </div>
              </div>
              <div>
                <Controller
                  control={control}
                  name="address"
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <InputText
                      {...field}
                      label={{ text: "Dirección" }}
                      placeholder="Dirección"
                      className="w-full"
                      id="address"
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                    />
                  )}
                />
              </div>
              <div>
                <Controller
                  control={control}
                  name="distrit"
                  defaultValue={undefined}
                  render={({ field, fieldState: { error } }) => (
                    <Dropdown
                      label={{ text: "Distrito" }}
                      placeholder="Nombre del hotel"
                      className="w-full"
                      filter
                      options={[
                        { label: "Distrito 1", value: "1" },
                        { label: "Distrito 2", value: "2" },
                        { label: "Distrito 3", value: "3" },
                      ]}
                      id="district"
                      invalid={!!error}
                      {...field}
                      small={{
                        text: error?.message,
                        className: "text-red-500 font-bold",
                      }}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          {/* HOTEL */}

          {/* ROOM */}
          <div className="mt-6">
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
                      <Dropdown
                        label={{ text: "Tipo de Habitación" }}
                        placeholder="Tipo de Habitación"
                        id="roomType"
                        className="w-full"
                        filter
                        options={[
                          { label: "Habitación 1", value: "1" },
                          { label: "Habitación 2", value: "2" },
                          { label: "Habitación 3", value: "3" },
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
                <div>
                  <Controller
                    control={control}
                    name="season"
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
              </div>

              <div>
                <Controller
                  control={control}
                  name="hotelName"
                  defaultValue=""
                  render={({ field, fieldState: { error } }) => (
                    <Dropdown
                      label={{ text: "Nombre del Hotel" }}
                      placeholder="Nombre del hotel"
                      id="hotelName"
                      className="w-full"
                      filter
                      options={[
                        { label: "Nombre del hotel 1", value: "1" },
                        { label: "Nombre del hotel 2", value: "2" },
                        { label: "Nombre del hotel 3", value: "3" },
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
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <InputText
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
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="serviceTax"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <InputText
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
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <InputText
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
                      />
                    )}
                  />
                </div>
                <div>
                  <Controller
                    control={control}
                    name="pricePen"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <InputText
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
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* ROOM */}
          <div className="flex justify-end">
            {/* <Button label="guardar" /> */}
            <SplitButton
              model={OPERATIONS}
              label="Opciones"
              loading={isLoadingHotelandRoom}
              icon="pi pi-cog"
              disabled={Object.keys(errors).length > 0 }
              className="bg-primary text-white mt-4"
            />
          </div>
        </form>
      </Dialog>

      <Button
        label="Nuevo Hotel"
        icon="pi pi-plus"
        className="bg-transparent text-black border-[#D0D5DD]"
        onClick={() => {
          setVisible(true);
        }}
      />
    </>
  );
};
