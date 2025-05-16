import { cityDto, CityDto } from "@/domain/dtos/city";
import { CountryEntity } from "@/domain/entities";
import {
  useGetCountriesAllQuery,
  useUpsertCityMutation,
} from "@/infraestructure/store/services";
import {
  Button,
  Checkbox,
  DefaultFallBackComponent,
  Dialog,
  Dropdown,
  ErrorBoundary,
  InputText,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

type Props = {
  rowData: CountryEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const CityEditAndRegisterModal = ({
  rowData,
  showModal,
  setShowModal,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<CityDto>({
    resolver: zodResolver(cityDto.getSchema),
    defaultValues: rowData.cities?.[0]?.id
      ? {
          cityId: rowData.cities[0].id,
          cityName: rowData.cities[0].name,
          countryId: rowData.id,
        }
      : {
          cityId: 0,
          cityName: "",
          countryId: rowData.id,
        },
  });

  const [checkCountry, setCheckCountry] = useState(true);

  const {
    data: countryall,
    refetch: isRefetchCountryAll,
    isLoading: isLoadingCountryAll,
    isFetching: isFetchingCountryAll,
    isError,
  } = useGetCountriesAllQuery();

  const [upsertCity, { isLoading }] = useUpsertCityMutation();

  const handleUpsertCity = async (data: CityDto) => {
    upsertCity(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };

  return (
    <Dialog
      header={
        <div className="text-sky-500">
          <i className="pi pi-map text-lg bg-gradient-to-r from-sky-500 to-sky-500 text-white rounded-full p-2 mr-3" />
          {`${rowData.cities?.[0]?.id ? "Editar" : "Registrar"} Ciudad`}
        </div>
      }
      visible={showModal}
      onHide={() => setShowModal(false)}
      style={{ height: "auto" }}
      breakpoints={{
        "960px": "75vw",
        "640px": "100vw",
      }}
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(handleUpsertCity)}
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="cityName"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                id="cityName"
                type="text"
                placeholder="Nombre del Ciudad"
                className="w-full"
                label={{
                  text: "Nombre del Ciudad",
                  className: "text-sky-500 text-[18px] font-bold mb-2",
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

        {/*  data country */}
        <div>
          <ErrorBoundary
            isLoader={isFetchingCountryAll || isLoadingCountryAll}
            fallBackComponent={
              <>
                <Controller
                  control={control}
                  name="countryId"
                  defaultValue={undefined}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <Dropdown
                        label={{ text: "Nombre del Pais" }}
                        placeholder="Nombre del Pais"
                        className="w-full"
                        filter
                        options={[]}
                        id="countryId"
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
                            refetch={isRefetchCountryAll}
                            isFetching={isFetchingCountryAll}
                            isLoading={isLoadingCountryAll}
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
              name="countryId"
              defaultValue={undefined}
              render={({ field, fieldState: { error } }) => {
                return (
                  <Dropdown
                    label={{
                      text: "Nombre del Pais",
                      className: "text-sky-500 text-[18px] font-bold mb-2",
                    }}
                    placeholder="Nombre del Pais"
                    className="w-full"
                    filter
                    checkmark={true}
                    options={countryall?.data}
                    itemTemplate={(option) => {
                      return (
                        <div className="flex gap-2 items-center">
                          <i
                            className="
                          pi pi-globe text-lg
                          bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-2
                          "
                          />
                          {option.name}
                        </div>
                      );
                    }}
                    disabled={checkCountry}
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
              loading={isLoadingCountryAll}
              value={checkCountry}
              onChange={(e) => setCheckCountry(!!e.checked)}
              label={{
                text: "Bloquear selección de Pais",
                htmlFor: "checkHotel",
                className: "ml-2 !text-sm !font-semibold",
              }}
              checked={checkCountry}
            />
          </div>
        </div>
        {/* end data country */}

        <div className="flex justify-end mt-3">
          <Button
            className="bg-gradient-to-r from-sky-500 to-sky-500 text-white"
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            disabled={!isDirty || isLoading}
            label={`${rowData.cities?.[0]?.id ? "Editar" : "Registrar"} `}
          />
        </div>
      </form>
    </Dialog>
  );
};
