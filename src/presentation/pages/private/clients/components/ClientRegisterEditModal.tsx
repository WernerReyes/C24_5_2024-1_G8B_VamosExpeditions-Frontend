import { ClientEntity } from "@/domain/entities";
import { Dialog } from "@/presentation/components";
import { useEffect, useState } from "react";
import { type ClientDto, clientDto } from "@/domain/dtos/client";
import {
  Checkbox,
  Dropdown,
  type DropdownChangeEvent,
  ErrorBoundary,
  InputMask,
  InputText,
  SplitButton,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { cn, type CountryCode, phoneNumberAdapter } from "@/core/adapters";

import Style from "../../newQuote/modules/CustomerData/components/Style.module.css";

import {
  useGetAllExternalCountriesQuery,
  useUpsertClientMutation,
  type ExternalCountryEntity,
} from "@/infraestructure/store/services";

import { SUBREGIONS } from "@/presentation/types";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import {
  onSetSelectedClient,
  onSetSincronizedCurrentTripDetailsByClient,
} from "@/infraestructure/store";
import { getCountryPhoneMask } from "../../newQuote/modules/CustomerData/utils";

const OPERATIONS = [
  {
    label: "Registrar cliente",
    loading: "Registrando...",
    icon: "pi pi-plus",
  },
  {
    label: "Actualizar cliente",
    loading: "Actualizando...",
    icon: "pi pi-pencil",
  },
];

type Props = {
  rowData?: ClientEntity;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const ClientRegisterEditModal = ({
  rowData,
  showModal,
  setShowModal,
}: Props) => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ClientDto>({
    resolver: zodResolver(clientDto.getSchema),
    defaultValues: clientDto.getEmpty,
  });
  

  const { currentTripDetails } = useSelector(
    (state: AppState) => state.tripDetails
  );

  const [upsertClient, { isLoading: isUpsertingClient }] =
    useUpsertClientMutation();
  const {
    data: externalCountries,
    isLoading: isGettingAllExternalCountries,
    isFetching: isFetchingAllExternalCountries,
    isError,
    error,
  } = useGetAllExternalCountriesQuery();

  const [selectedCountry, setSelectedCountry] =
    useState<ExternalCountryEntity>();

  const [currentOp, setCurrentOp] = useState(OPERATIONS[0]);
  const [suggestPhone, setSuggestPhone] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);
  const [numberPhone, setNumberPhone] = useState<string | null>(
    currentTripDetails?.client?.phone ?? null
  );

  const handleOperation = (op: (typeof OPERATIONS)[number]) => {
    setCurrentOp(op);
    if (op === OPERATIONS[0]) {
      reset(clientDto.getEmpty);
      setSelectedCountry(undefined);
      setSuggestPhone(false);
    }

    if (op === OPERATIONS[1] && rowData) {
      const country = externalCountries?.data.find(
        (country) => country.name === rowData.country.name
      );
      reset(clientDto.parse(rowData));
      setSelectedCountry(country);
      setSuggestPhone(true);
    }
  };

  const handleUpsertClient = (clientDto: ClientDto) => {
    let client =
      currentOp === OPERATIONS[1] ? clientDto : { ...clientDto, id: 0 };
    upsertClient(client)
      .unwrap()
      .then(({ data }) => {
        if (currentOp === OPERATIONS[1]) {
          dispatch(onSetSelectedClient(data));
          if (currentTripDetails) {
            dispatch(
              onSetSincronizedCurrentTripDetailsByClient({
                ...currentTripDetails,
                client: data,
              })
            );
          }
        }

        setShowModal(false);
      });
  };

  useEffect(() => {
    if (externalCountries && selectedCountry) {
      setSelectedCountry(
        externalCountries.data.find(
          (country) => country.code == selectedCountry.code
        )
      );
    }
  }, [selectedCountry, externalCountries]);

  useEffect(() => {
    if (rowData) {
      const country = externalCountries?.data.find(
        (country) => country.name === rowData.country.name
      );
      reset(clientDto.parse(rowData));
      setSelectedCountry(country);
      setSuggestPhone(true);
      setCurrentOp(OPERATIONS[1]);
      setValue("id", rowData.id);
      setNumberPhone(rowData.phone);
    } else {
      reset(clientDto.getEmpty);
      setSelectedCountry(undefined);
      setCurrentOp(OPERATIONS[0]);
    }
    setIsContentLoading(false);
  }, [rowData, externalCountries]);

  const countryPhoneMask = getCountryPhoneMask(selectedCountry);

  return (
    <Dialog
      breakpoints={{
        "960px": "75vw",
        "640px": "100vw",
      }}
      header={
        <div className="flex items-center mb-2 gap-x-2 text-lg">
          <i className="pi pi-user text-primary text-xl"></i>
          <h5 className="font-bold ">Datos del cliente</h5>
        </div>
      }
      visible={showModal}
      onHide={() => setShowModal(false)}
    >
      <form
        className={Style.form}
        onSubmit={handleSubmit(handleUpsertClient)}
        noValidate
      >
        <div className={Style.container}>
          <Controller
            control={control}
            name="fullName"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={{
                  htmlFor: "Nombre completo ",
                  text: "Nombre completo",
                }}
                type="text"
                small={{
                  text: error?.message,
                }}
                id="name"
                placeholder="Nombre completo"
                invalid={!!error}
                {...field}
                loading={isContentLoading}
              />
            )}
          />
        </div>

        <div className={Style.container}>
          <Controller
            control={control}
            name="email"
            defaultValue={null}
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={{
                  htmlFor: "Correo electronico",
                  text: "Correo electronico",
                }}
                type="email"
                small={{
                  text: error?.message,
                  className: "text-red-500",
                }}
                placeholder="Correo electronico"
                id="email"
                invalid={!!error}
                {...field}
                loading={isContentLoading}
              />
            )}
          />
        </div>

        <div className={Style.container}>
          <ErrorBoundary
            isLoader={
              isGettingAllExternalCountries || isFetchingAllExternalCountries
            }
            loadingComponent={
              <InputText
                label={{
                  htmlFor: "country",
                  text: "País de origen",
                }}
                loading
                disabled
                placeholder="País de origen"
                id="country"
              />
            }
            fallBackComponent={
              <>
                <Controller
                  control={control}
                  name="country"
                  defaultValue={undefined}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <InputText
                        label={{
                          htmlFor: "country",
                          text: "País de origen",
                        }}
                        small={{
                          text: error?.message,
                          className: "text-red-500",
                        }}
                        loading={
                          isContentLoading || isGettingAllExternalCountries
                        }
                        disabled={
                          isContentLoading || isGettingAllExternalCountries
                        }
                        placeholder="País de origen"
                        invalid={!!error}
                        {...field}
                      />
                    );
                  }}
                />

                <div className={Style.container + " mt-5"}>
                  <Controller
                    control={control}
                    name="subregion"
                    defaultValue=""
                    render={({ field, fieldState: { error } }) => (
                      <Dropdown
                        label={{
                          htmlFor: "subregion",
                          text: "Subregión",
                        }}
                        small={{
                          text: error?.message,
                          className: "text-red-500",
                        }}
                        disabled={
                          isContentLoading || isGettingAllExternalCountries
                        }
                        filter
                        id="country"
                        placeholder="Seleccione una subregión"
                        invalid={!!error}
                        options={SUBREGIONS}
                        virtualScrollerOptions={{ itemSize: 38 }}
                        {...field}
                      />
                    )}
                  />
                </div>
              </>
            }
            error={!!error}
          >
            <Controller
              control={control}
              name="country"
              defaultValue={undefined}
              render={({ field, fieldState: { error } }) => {
                const country = externalCountries?.data.find(
                  (country) => country.name === field?.value
                );

                return (
                  <Dropdown
                    label={{
                      htmlFor: "country",
                      text: "País de origen",
                    }}
                    small={{
                      text: error?.message,
                      className: "text-red-500",
                    }}
                    loading={isContentLoading || isGettingAllExternalCountries}
                    disabled={isContentLoading || isGettingAllExternalCountries}
                    filter
                    valueTemplate={selectedCountryTemplate}
                    itemTemplate={countryOptionTemplate}
                    id="country"
                    placeholder="Seleccione un país"
                    invalid={!!error}
                    options={externalCountries?.data}
                    optionLabel="name"
                    value={country}
                    virtualScrollerOptions={{ itemSize: 38 }}
                    onChange={(e: DropdownChangeEvent) => {
                      field.onChange(e.value.name);
                      setValue("subregion", e.value.subregion);
                      setSelectedCountry(e.value);
                    }}
                  />
                );
              }}
            />
          </ErrorBoundary>
        </div>

        <div className={Style.container}>
          <Controller
            control={control}
            name="phone"
            defaultValue={null}
            render={({ field, fieldState: { error } }) => {
              return (
                <>
                  {countryPhoneMask && suggestPhone ? (
                    <InputMask
                      id="phone"
                      mask={countryPhoneMask}
                      placeholder={countryPhoneMask ?? "Telefono"}
                      label={{
                        htmlFor: "phone",
                        text: "Telefono ( +51999999999 )",
                      }}
                      value={numberPhone}
                      onChange={(e) => {
                        if (!e.value) return field.onChange(e.value);
                        const parsedValue = phoneNumberAdapter.parse(
                          e.value,
                          selectedCountry?.code as CountryCode
                        )?.number;

                        field.onChange(parsedValue ?? e.value);
                      }}
                      loading={isContentLoading}
                      invalid={!!error}
                      small={{
                        text: error?.message,
                        className: cn({
                          "!text-black":
                            countryPhoneMask === null && suggestPhone,
                        }),
                      }}
                    ></InputMask>
                  ) : (
                    <InputText
                      label={{
                        htmlFor: "phone",
                        text: "Telefono ( +51999999999 )",
                      }}
                      maxLength={30}
                      small={{
                        text:
                          countryPhoneMask === null && suggestPhone
                            ? "Formato de telefono no encontrado"
                            : error?.message,
                        className: cn({
                          "!text-black":
                            countryPhoneMask === null && suggestPhone,
                        }),
                      }}
                      loading={isContentLoading}
                      placeholder="Telefono"
                      id="phone"
                      invalid={!!error}
                      {...field}
                    />
                  )}
                </>
              );
            }}
          />
          {!isError && (
            <div className="flex justify-items-center mt-2">
              <Checkbox
                inputId="suggestPhone"
                name="suggestPhone"
                loading={isContentLoading}
                value={suggestPhone}
                onChange={(e) => setSuggestPhone(!!e.checked)}
                label={{
                  text: "Sugerir formato de telefono",
                  htmlFor: "suggestPhone",
                  className: "ml-2 !text-sm !font-semibold",
                }}
                checked={suggestPhone}
              />
            </div>
          )}
        </div>

        <SplitButton
          label={isUpsertingClient ? currentOp.loading : currentOp.label}
          loading={isContentLoading || isUpsertingClient}
          disabled={
            isContentLoading ||
            isUpsertingClient ||
            isGettingAllExternalCountries ||
            Object.keys(errors).length > 0 ||
            (!isDirty && currentOp === OPERATIONS[1])
          }
          icon={currentOp.icon}
          menuClassName={cn({ hidden: !rowData })}
          dropdownIcon={!rowData ? "pi pi-ban" : undefined}
          onClick={() => {
            handleSubmit(handleUpsertClient)();
          }}
          typeof="submit"
          className="mt-auto"
          model={OPERATIONS.map((op) => ({
            label: op.label,
            icon: op.icon,
            command: () => handleOperation(op),
            className: cn(
              "border-[#D0D5DD]",
              currentOp === op ? "bg-secondary" : "text-black bg-transparent"
            ),
          }))}
        />
      </form>
    </Dialog>
  );
};
const countryOptionTemplate = (option: ExternalCountryEntity) => {
  return (
    <div className="flex items-center">
      <img
        alt={option.name}
        src={option.image.png}
        className={`mr-2 flag flag-${option.code.toLowerCase()}`}
        style={{ width: "18px" }}
      />
      <div>{option.name}</div>
    </div>
  );
};

const selectedCountryTemplate = (option: ExternalCountryEntity, props: any) => {
  if (option) {
    return (
      <div className="flex items-center">
        <img
          alt={option.name}
          src={option.image.png}
          className={`mr-2 flag flag-${option.code.toLowerCase()}`}
          style={{ width: "18px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  }

  return <span>{props.placeholder}</span>;
};
