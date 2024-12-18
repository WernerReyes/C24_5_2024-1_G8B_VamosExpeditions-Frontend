import {
  newClientDtoSchema,
  RegisterClientDto,
  registerClientDtoSchema,
} from "@/domain/dtos/client";
import {
  useClientStore,
  useExternalCountryStore,
} from "@/infraestructure/hooks";
import { Button, Dropdown, InputText } from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import Style from "../Style.module.css";
import { useEffect, useState } from "react";
import { ExternalCountryEntity } from "@/infraestructure/services/external/country";

export const ClientForm = () => {
  const { startRegisterClient } = useClientStore();
  const { externalCountries, startGetAllExternalCountries } =
    useExternalCountryStore();
  const { control, handleSubmit, reset } = useForm<RegisterClientDto>({
    resolver: zodResolver(registerClientDtoSchema),
  });

  const handleForm = (registerClientDto: RegisterClientDto) => {
    console.log(registerClientDto);
    startRegisterClient(registerClientDto)
      .then(() => {
        reset();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    startGetAllExternalCountries();
    console.log("useEffect");
  }, []);


  return (
    <form className={Style.form} onSubmit={handleSubmit(handleForm)} noValidate>
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
              id="email"
              invalid={!!error}
              {...field}
            />
          )}
        />
      </div>

      <div className={Style.container}>
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
              />
            );
          }}
        />
      </div>

      <div className={Style.container}>
        <Controller
          control={control}
          name="phone"
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <InputText
              label={{
                htmlFor: "Telefono",
                text: "Telefono",
              }}
              type="number"
              small={{
                text: error?.message,
                className: "text-red-500",
              }}
              id="phone"
              invalid={!!error}
              {...field}
            />
          )}
        />
      </div>

      <Button icon="pi pi-save" label="Guardar" />
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
