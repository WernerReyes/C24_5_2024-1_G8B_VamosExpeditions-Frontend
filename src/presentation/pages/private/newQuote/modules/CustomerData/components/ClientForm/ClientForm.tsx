import { useEffect, useState } from "react";
import {
  type ClientDto,
  clientDtoEmpty,
  clientDtoSchema,
} from "@/domain/dtos/client";
import {
  Checkbox,
  DefaultFallBackComponent,
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

import type { ExternalCountryEntity } from "@/infraestructure/store/services/external/country";
import {
  useClientStore,
  useExternalCountryStore,
  useReservationStore,
} from "@/infraestructure/hooks";
import { getCountryPhoneMask } from "../../utils";

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
  const {
    selectedClient,
    startCreatingClient,
    startUpdatingClient,
    createClientResult: { isCreatingClient },
    updateClientResult: { isUpdatingClient },
  } = useClientStore();
  const { startUpdatingReservationClient } = useReservationStore();
  const {
    externalCountries,
    startGetAllExternalCountries,
    getAllExternalCountriesResult: {
      isGettingAllExternalCountries,
      error,
      refetch,
      isFetching,
    },
  } = useExternalCountryStore();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientDto>({
    resolver: zodResolver(clientDtoSchema),
  });
  const [selectedCountry, setSelectedCountry] =
    useState<ExternalCountryEntity>();
  const [currentOp, setCurrentOp] = useState(OPERATIONS[0]);
  const [suggestPhone, setSuggestPhone] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(true);

  const handleOperation = (op: (typeof OPERATIONS)[number]) => {
    setCurrentOp(op);
    if (op === OPERATIONS[0]) {
      reset(clientDtoEmpty);
      setSelectedCountry(undefined);
      setSuggestPhone(false);
    }

    if (op === OPERATIONS[1] && selectedClient) {
      const country = externalCountries.find(
        (country) => country.name === selectedClient.country
      );
      reset({
        fullName: selectedClient.fullName,
        email: selectedClient.email,
        phone: selectedClient.phone,
        country,
      });
      setSelectedCountry(country);
      setSuggestPhone(true);
    }
  };

  const handleForm = (clientDto: ClientDto) => {
    if (selectedClient && currentOp === OPERATIONS[1]) {
      startUpdatingClient(selectedClient.id, clientDto).then((client) => {
        startUpdatingReservationClient(client);
        reset();
      });
      return;
    }
    startCreatingClient(clientDto).then(() => {
      reset();
    });
  };

  useEffect(() => {
    startGetAllExternalCountries();
  }, []);

  useEffect(() => {
    if (externalCountries && selectedCountry) {
      setSelectedCountry(
        externalCountries.find(
          (country) => country.code == selectedCountry.code
        )
      );
    }
  }, [selectedCountry, externalCountries]);

  useEffect(() => {
    if (selectedClient) {
      const country = externalCountries.find(
        (country) => country.name === selectedClient.country
      );

      reset({
        fullName: selectedClient.fullName,
        email: selectedClient.email,
        phone: selectedClient.phone,
        country,
      });
      setSelectedCountry(country);
      setSuggestPhone(true);
      setCurrentOp(OPERATIONS[1]);
    } else {
      reset(clientDtoEmpty);
      setSelectedCountry(undefined);
      setSuggestPhone(false);
      setCurrentOp(OPERATIONS[0]);
    }
    setIsContentLoading(false);
  }, [selectedClient, externalCountries]);

  const countryPhoneMask = getCountryPhoneMask(selectedCountry);

  return (
    <form
      className={`${Style.form} flex-[1] `}
      onSubmit={handleSubmit(handleForm)}
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
          fallBackComponent={
            <>
              <label htmlFor="country">País de origen</label>
              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isGettingAllExternalCountries}
                message="No se pudo cargar los paises"
              />
            </>
          }
          error={!!error}
        >
          <Controller
            control={control}
            name="country"
            defaultValue={undefined}
            render={({ field, fieldState: { error } }) => {
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
                  options={externalCountries}
                  optionLabel="name"
                  {...field}
                  virtualScrollerOptions={{ itemSize: 38 }}
                  onChange={(e: DropdownChangeEvent) => {
                    field.onChange(e.value);
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
      </div>

      <SplitButton
        label={
          isCreatingClient || isUpdatingClient
            ? currentOp.loading
            : currentOp.label
        }
        loading={isContentLoading || isCreatingClient || isUpdatingClient}
        disabled={
          isContentLoading ||
          isCreatingClient ||
          isGettingAllExternalCountries ||
          Object.keys(errors).length > 0
        }
        icon={currentOp.icon}
        menuClassName={classNamesAdapter({ hidden: !selectedClient })}
        dropdownIcon={!selectedClient ? "pi pi-ban" : undefined}
        onClick={() => {
          handleSubmit(handleForm)();
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

