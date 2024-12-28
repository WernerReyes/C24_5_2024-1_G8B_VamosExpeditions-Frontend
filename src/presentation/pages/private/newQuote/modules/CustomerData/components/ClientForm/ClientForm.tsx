import {
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
import { DropdownChangeEvent } from "primereact/dropdown";

export const ClientForm = () => {
  //const url = `https://restcountries.com/v3.1/name/${countryName}`;

  const [sc, setSc] = useState({
    name: "",
    code: "",
    image: {
      png: "",
      svg: "",
    },
    root: "",
  });
  
  const { startRegisterClient } = useClientStore();


  const { externalCountries, startGetAllExternalCountries } =useExternalCountryStore();
 
  

  externalCountries.filter((country) => country.name === sc.name);
  
   

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
            root: "",
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
                onChange={(e: DropdownChangeEvent) => {
                  field.onChange(e.value);
                  /* console.log(e.value); */
                  setSc(e.value);
                }}
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
             
              placeholder="Telefono"
              id="phone"
              invalid={!!error}
              {...field
               

              }
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
