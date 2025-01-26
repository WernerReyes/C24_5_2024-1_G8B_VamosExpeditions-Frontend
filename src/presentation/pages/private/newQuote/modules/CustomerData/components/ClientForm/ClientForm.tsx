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

import {
  classNamesAdapter,
  type CountryCode,
  phoneNumberAdapter,
} from "@/core/adapters";

import Style from "../Style.module.css";

import {
  useGetAllExternalCountriesQuery,
  useUpsertClientMutation,
  type ExternalCountryEntity,
} from "@/infraestructure/store/services";
import { getCountryPhoneMask } from "../../utils";
import { SUBREGIONS } from "@/presentation/types";
import { useDispatch, useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import { onSetSincronizedCurrentReservationByClient } from "@/infraestructure/store";

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

export const ClientForm = () => {
  const dispatch = useDispatch();
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClientDto>({
    resolver: zodResolver(clientDto.getSchema),
    defaultValues: clientDto.getEmpty,
  });
  const { selectedClient } = useSelector((state: AppState) => state.client);

  const { currentReservation } = useSelector(
    (state: AppState) => state.reservation
  );

  const [upsertClient, { isLoading: isUpsertingClient }] =
    useUpsertClientMutation();
  const {
    data: externalCountries,
    isLoading: isGettingAllExternalCountries,
    isError,
    error,
  } = useGetAllExternalCountriesQuery();
  const [selectedCountry, setSelectedCountry] =
    useState<ExternalCountryEntity>();
  const [currentOp, setCurrentOp] = useState(OPERATIONS[0]);
  const [suggestPhone, setSuggestPhone] = useState(true);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const handleOperation = (op: (typeof OPERATIONS)[number]) => {
    setCurrentOp(op);
    if (op === OPERATIONS[0]) {
      reset(clientDto.getEmpty);
      setSelectedCountry(undefined);
      setSuggestPhone(false);
    }

    if (op === OPERATIONS[1] && selectedClient) {
      const country = externalCountries?.data.find(
        (country) => country.name === selectedClient.country
      );
      reset(clientDto.parse(selectedClient));
      setSelectedCountry(country);
      setSuggestPhone(true);
    }
  };

  const handleUpsertClient = (clientDto: ClientDto) => {
    let client =
      currentOp === OPERATIONS[1]
        ? clientDto
        : {
            ...clientDto,
            id: 0,
          };
    upsertClient(client)
      .unwrap()
      .then(({ data }) => {
        if (currentOp === OPERATIONS[1]) { 
        dispatch(
          onSetSincronizedCurrentReservationByClient({
            ...currentReservation!,
            client: data,
          })
        );
        }
      }).catch((error) => {
        console.error(error);
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
    if (selectedClient) {
      const country = externalCountries?.data.find(
        (country) => country.name === selectedClient.country
      );
      reset(clientDto.parse(selectedClient));
      setSelectedCountry(country);
      setSuggestPhone(true);
      setCurrentOp(OPERATIONS[1]);
    } else {
      reset(clientDto.getEmpty);
      setSelectedCountry(undefined);
      setCurrentOp(OPERATIONS[0]);
    }
    setIsContentLoading(false);
  }, [selectedClient, externalCountries]);

  const countryPhoneMask = getCountryPhoneMask(selectedCountry);

  return (
    <form
      className={`${Style.form} flex-[1] `}
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
          defaultValue=""
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
          isLoader={isGettingAllExternalCountries}
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
                      loading={
                        isContentLoading || isGettingAllExternalCountries
                      }
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
          defaultValue=""
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
                    {...field}
                    onChange={(e) => {
                      if (!e.value) return field.onChange(e.value);
                      const parsedValue = phoneNumberAdapter.parse(
                        e.value,
                        selectedCountry?.code as CountryCode
                      )?.number;
                      return field.onChange(parsedValue ?? e.value);
                    }}
                    loading={isContentLoading}
                    invalid={!!error}
                    small={{
                      text: error?.message,
                      className: classNamesAdapter({
                        "!text-black":
                          countryPhoneMask === null && suggestPhone,
                      }),
                    }}
                    autoClear={false}
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
                      className: classNamesAdapter({
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

      <Controller
        control={control}
        name="id"
        render={({ field }) => <input type="hidden" id="id" {...field} />}
      />

      <SplitButton
        label={
          // isCreatingClient || isUpdatingClient
          isUpsertingClient ? currentOp.loading : currentOp.label
        }
        loading={isContentLoading || isUpsertingClient}
        disabled={
          isContentLoading ||
          isUpsertingClient ||
          isGettingAllExternalCountries ||
          Object.keys(errors).length > 0
        }
        icon={currentOp.icon}
        menuClassName={classNamesAdapter({ hidden: !selectedClient })}
        dropdownIcon={!selectedClient ? "pi pi-ban" : undefined}
        onClick={() => {
          handleSubmit(handleUpsertClient)();
        }}
        typeof="submit"
        className="mt-auto"
        model={OPERATIONS.map((op) => ({
          label: op.label,
          icon: op.icon,
          command: () => handleOperation(op),
          className: classNamesAdapter(
            "border-[#D0D5DD]",
            currentOp === op ? "bg-secondary" : "text-black bg-transparent"
          ),
        }))}
      />
    </form>
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
