import { distritDto, DistritDto } from "@/domain/dtos/distrit";
import { CityEntity } from "@/domain/entities";
import {
  useGetCitiesAllQuery,
  useGetCountriesAllQuery,
  useUpsertDistritMutation,
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
  rowData: CityEntity;
  showModal: boolean;
  country?: {
    id: number;
    name: string;
  };
  setShowModal: (showModal: boolean) => void;
};

export const DistritEditAndRegisterModal = ({
  rowData,
  showModal,
  country,
  setShowModal,
}: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm<DistritDto>({
    resolver: zodResolver(distritDto.getSchema),
    defaultValues: rowData.distrits?.[0]?.id
      ? {
          distritId: rowData.distrits[0].id,
          distritName: rowData.distrits[0].name,
          countryId: country?.id,
          cityId: rowData.id,
        }
      : {
          distritId: 0,
          distritName: "",
          countryId: country?.id,
          cityId: rowData.id,
        },
  });

  const [checkCountry, setCheckCountry] = useState(true);
  const [checkCity, setCheckCity] = useState(true);

  // apis city and country
  const {
    data: countryall,
    refetch: isRefetchCountryAll,
    isLoading: isLoadingCountryAll,
    isFetching: isFetchingCountryAll,
    isError,
  } = useGetCountriesAllQuery();
  const {
    data: cityall,
    refetch: isRefetchCityAll,
    isLoading: isLoadingCityAll,
    isFetching: isFetchingCityAll,
    isError: isErrorCity,
  } = useGetCitiesAllQuery();
  // end apis city and country

  const [upsertDistrit, { isLoading }] = useUpsertDistritMutation();
  const handleUpsertDistrit = async (data: DistritDto) => {
    upsertDistrit(data)
      .unwrap()
      .then(() => {
        reset();
      });
  };
  return (
    <Dialog
      header={
        <div className="text-amber-500">
          <i className="pi pi-map-marker text-sm bg-gradient-to-r from-amber-400 to-orange-400 p-2 text-white rounded-full mr-3" />
          {`${rowData?.distrits?.[0].id ? "Editar" : "Registrar"} Distritos`}
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
        onSubmit={handleSubmit(handleUpsertDistrit)}
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="distritName"
            defaultValue=""
            render={({ field, fieldState: { error } }) => {
              return (
                <InputText
                  id="distritName"
                  type="text"
                  placeholder="Nombre del Ciudad"
                  className="w-full"
                  label={{
                    text: "Nombre del Ciudad",
                    className: "text-amber-500 text-[18px] font-bold mb-2",
                  }}
                  invalid={!!error}
                  {...field}
                  small={{
                    text: error?.message,
                    className: "text-red-500 font-bold",
                  }}
                />
              );
            }}
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
                        label={{
                          text: "Nombre del país",
                          className:
                            "text-amber-500 text-[18px] font-bold mb-2",
                        }}
                        placeholder="Nombre del país"
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
                            message="No se pudieron cargar los países"
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
                      text: "Nombre del país",
                      className: "text-amber-500 text-[18px] font-bold mb-2",
                    }}
                    placeholder="Nombre del país"
                    className="w-full"
                    filter
                    checkmark={true}
                    options={countryall?.data}
                    itemTemplate={(option) => {
                      return (
                        <div className="flex gap-2 items-center">
                          <i
                            className="pi pi-globe text-lg
                        bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full p-2"
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
                text: "Bloquear selección de país",
                htmlFor: "checkHotel",
                className: "ml-2 !text-sm !font-semibold",
              }}
              checked={checkCountry}
            />
          </div>
        </div>
        {/* end data country */}

        {/* start data city */}
        <div>
          <ErrorBoundary
            isLoader={isFetchingCityAll || isLoadingCityAll}
            fallBackComponent={
              <>
                <Controller
                  control={control}
                  name="cityId"
                  defaultValue={undefined}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <Dropdown
                        label={{
                          text: "Nombre del ciudad",
                          className:
                            "text-amber-500 text-[18px] font-bold mb-2",
                        }}
                        placeholder="Nombre del ciudad"
                        className="w-full"
                        filter
                        options={[]}
                        id="cityId"
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
                            refetch={isRefetchCityAll}
                            isFetching={isFetchingCityAll}
                            isLoading={isLoadingCityAll}
                            message="No se pudieron cargar las ciudades"
                          />
                        }
                      />
                    );
                  }}
                />
              </>
            }
            error={isErrorCity}
          >
            <Controller
              control={control}
              name="cityId"
              defaultValue={undefined}
              render={({ field, fieldState: { error } }) => {
                return (
                  <Dropdown
                    label={{
                      text: "Nombre de la ciudad",
                      className: "text-amber-500 text-[18px] font-bold mb-2",
                    }}
                    placeholder="Nombre de la ciudad"
                    className="w-full"
                    filter
                    checkmark={true}
                    options={cityall?.data}
                    itemTemplate={(option) => {
                      return (
                        <div className="flex gap-2 items-center">
                          <i
                            className="pi pi-map text-sm bg-gradient-to-r from-sky-500 to-sky-500 text-white rounded-full p-2 
                          "
                          />
                          {option.name}
                        </div>
                      );
                    }}
                    disabled={checkCity}
                    id="cityId"
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
              inputId="checkCity"
              name="checkCity"
              loading={isLoadingCityAll}
              value={checkCity}
              onChange={(e) => setCheckCity(!!e.checked)}
              label={{
                text: "Bloquear selección de las ciudades",
                htmlFor: "checkCity",
                className: "ml-2 !text-sm !font-semibold",
              }}
              checked={checkCity}
            />
          </div>
        </div>

        <div className="flex justify-end mt-3">
          <Button
            icon={isLoading ? "pi pi-spin pi-spinner" : "pi pi-save"}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white
             border-none
            "
            disabled={!isDirty || isLoading}
            label={`${rowData?.distrits?.[0]?.id ? "Editar" : "Registrar"} `}
          />
        </div>
      </form>
    </Dialog>
  );
};
