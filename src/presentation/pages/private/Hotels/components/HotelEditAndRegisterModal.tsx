import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { HotelEntity } from "@/domain/entities";
import {
  Button,
  DefaultFallBackComponent,
  Dialog,
  Dropdown,
  ErrorBoundary,
  InputText,
  Rating,
} from "@/presentation/components";
import { hotelDto, HotelDto, HotelRoomType } from "@/domain/dtos/hotel";

import Styles from "./Style.module.css";
import { useGetDistritsQuery } from "@/infraestructure/store/services";
type Props = {
  rowData: HotelEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};
export const HotelEditAndRegisterModal = ({
  setShowModal,
  showModal,
  rowData,
}: Props) => {
  //Api
  const {
    data: distrits,
    refetch: isRefetchDistrits,
    isLoading: isLoadingDistrits,
    isFetching: isFetchingDistrits,
    isError,
    /* error, */
  } = useGetDistritsQuery();
  /* console.log(distrits); */

  //Hook Form
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<HotelDto>({
    resolver: zodResolver(hotelDto.getSchema),
    defaultValues: rowData?.id
      ? {
          id: rowData.id,
          type: HotelRoomType.HOTEL,
          name: rowData.name,
          address: rowData.address,
          category: rowData.category ?? undefined,
          distrit: rowData.distrit?.id ?? undefined,
        }
      : {
          type: HotelRoomType.HOTEL,
          name: "",
          address: "",
          category: undefined,
          distrit: undefined,
        },
  });

  const handleUpsertHotel = async (data: HotelDto) => {
    console.log(data);
  };

  return (
    <>
      <Dialog
        header={`${rowData.id ? "Editar" : "Registrar"} Hotel`}
        visible={showModal}
        onHide={() => setShowModal(false)}
        style={{ height: "auto" }}
        className="sm:w-[60vw] w-full"
      >
        <form
          onSubmit={handleSubmit(handleUpsertHotel)}
          noValidate
          className={Styles.form}
        >
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
                          { label: "3", value: "3" },
                          { label: "4", value: "4" },
                          { label: "5", value: "5" },
                          { label: "BOUTIQUE", value: "BOUTIQUE" },
                          { label: "VILLA", value: "VILLA" },
                          { label: "LODGE", value: "LODGE" },
                        ]}
                        itemTemplate={(option) => {
                          const numValue = parseInt(option.label);
                          return (
                            <div className="flex items-center gap-2">
                              {!isNaN(numValue) ? (
                                <Rating
                                  value={numValue}
                                  cancel={false}
                                  readOnly
                                  onIcon="pi pi-star-fill text-yellow-500"
                                />
                              ) : (
                                <span className="text-primary font-bold">
                                  {option.label}
                                </span>
                              )}
                            </div>
                          );
                        }}
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

              {/* Distrit */}
              <div>
                <ErrorBoundary
                  isLoader={isFetchingDistrits || isLoadingDistrits}
                  fallBackComponent={
                    <>
                      <Controller
                        control={control}
                        name="distrit"
                        defaultValue={undefined}
                        render={({ field, fieldState: { error } }) => {
                          /* const country = distrits?.data.find(
                            (country) => country.name === field?.value
                          ); */
                          return (
                            <Dropdown
                              label={{ text: "Distrito" }}
                              placeholder="Nombre del hotel"
                              className="w-full"
                              filter
                              options={[]}
                              id="district"
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
                                  refetch={isRefetchDistrits}
                                  isFetching={isFetchingDistrits}
                                  isLoading={isLoadingDistrits}
                                  message="No se pudieron cargar los distritos"
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
                    name="distrit"
                    defaultValue={undefined}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <Dropdown
                          label={{ text: "Distrito" }}
                          placeholder="Nombre del hotel"
                          className="w-full"
                          filter
                          checkmark={true}
                          options={distrits?.data}
                          itemTemplate={(option) => {
                            return (
                              <div className="flex gap-2 items-center">
                                <i className="pi pi-map-marker text-xl text-primary" />
                                {option.name}
                              </div>
                            );
                          }}
                          id="district"
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
              </div>
              {/* Distrit */}
            </div>
          </div>

          <div className="flex justify-end mt-3">
            <Button
              icon="pi pi-save"
              disabled={!isDirty}
              label={`${rowData.id ? "Editar" : "Registrar"} `}
            />
          </div>

          {/* HOTEL */}
        </form>
      </Dialog>
    </>
  );
};
