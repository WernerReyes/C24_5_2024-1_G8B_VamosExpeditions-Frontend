import { useEffect, useState } from "react";
import {
  RegisterClientDto,
  registerClientDtoSchema,
} from "@/domain/dtos/client";
import {
  Button,
  Checkbox,
  DefaultFallBackComponent,
  Dropdown,
  ErrorBoundary,
  InputMask,
  InputText,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { DropdownChangeEvent } from "primereact/dropdown";
import {
  useGetAllExternalCountriesQuery,
  useRegisterClientMutation,
} from "@/infraestructure/store/services";

import {
  classNamesAdapter,
  CountryCode,
  phoneNumberAdapter,
} from "@/core/adapters";

import Style from "../Style.module.css";
import { useAlert } from "@/presentation/hooks";
import type { ExternalCountryEntity } from "@/infraestructure/store/services/external/country";

export const ClientForm = () => {
  const [registerClient, { isLoading: isRegisteringClient }] =
    useRegisterClientMutation();
  const { data, isLoading, error, refetch, isFetching } =
    useGetAllExternalCountriesQuery();

  const { control, handleSubmit, reset, formState: { errors } } = useForm<RegisterClientDto>({
    resolver: zodResolver(registerClientDtoSchema),
  });
  const { startShowSuccess, startShowApiError } = useAlert();
  const [selectedCountry, setSelectedCountry] =
    useState<ExternalCountryEntity>();
  const [suggestPhone, setSuggestPhone] = useState(false);

  const handleForm = (registerClientDto: RegisterClientDto) => {
    registerClient(registerClientDto)
      .unwrap()
      .then(() => {
        reset();
        startShowSuccess("Cliente registrado con éxito");
      })
      .catch((error) => {
        startShowApiError(error);
      });
  };

  useEffect(() => {
    if (data && selectedCountry) {
      setSelectedCountry(
        data.data.find((country) => country.code == selectedCountry.code)
      );
    }
  }, [selectedCountry, data]);

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
            />
          )}
        />
      </div>

      <div className={Style.container}>
        <ErrorBoundary
          fallBackComponent={
            <>
              <label
                htmlFor="
            country"
                className="text-red-500
            "
              >
                País de origen
              </label>

              <DefaultFallBackComponent
                refetch={refetch}
                isFetching={isFetching}
                isLoading={isLoading}
                message="No se pudo cargar los paises"
              />
            </>
          }
          error={!!error}
        >
          <Controller
            control={control}
            name="country"
            defaultValue={{
              code: "",
              name: "",
              image: {
                png: "",
                svg: "",
              },
              continent: "",
            }}
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
                  loading={isLoading}
                  disabled={isLoading}
                  filter
                  valueTemplate={selectedCountryTemplate}
                  itemTemplate={countryOptionTemplate}
                  id="country"
                  placeholder="Seleccione un país"
                  invalid={!!error}
                  options={data?.data}
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

      <Button
        icon={isRegisteringClient ? "pi pi-spin pi-spinner" : "pi pi-save"}
        className="mt-auto"
        label={isRegisteringClient ? "Registrando..." : "Registrar"}
        disabled={isRegisteringClient || isLoading || Object.keys(errors).length > 0}
        type="submit"
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

const getCountryPhoneMask = (country?: ExternalCountryEntity) => {
  if (country) {
    const countryCode = country.code as CountryCode;
    if (!phoneNumberAdapter.existsCountry(countryCode)) return null;
    const numberExample = phoneNumberAdapter
      .getExampleNumber(countryCode)
      ?.formatNational();
    const countryCallingCode =
      phoneNumberAdapter.getExampleNumber(countryCode)?.countryCallingCode;
    const numberReplaceByNine = numberExample?.replace(/[0-9]/g, "9");
    return `(+${countryCallingCode}) ${numberReplaceByNine}`;
  }

  return undefined;
};
