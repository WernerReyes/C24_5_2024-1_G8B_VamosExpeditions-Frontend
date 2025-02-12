import { QuoteEntity, VersionEntity, VersionQuotationEntity } from "@/domain/entities";
import { useReportStore } from "@/infraestructure/hooks";
import {
  Button,
  Dialog,
  InputText,
  InputTextarea,
  MultiSelect,
  SelectButton,
} from "@/presentation/components";

import { useState } from "react";
import Style from "./dialog.module.css";

import { Controller, useForm } from "react-hook-form";
import { EmailDto, emailDtoSchema } from "@/domain/dtos/email";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectButtonChangeEvent } from "primereact/selectbutton";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";

type TyoeTableActions = {
  rowData: VersionQuotationEntity
  type: "principal" | "secondary";
};

export const TableActions = ({ type, rowData }: TyoeTableActions) => {


  

  const { downloadPdf, isLoading } = useReportStore();


  const [visible, setVisible] = useState(false);

  const resources = [
    "Transporte",
    "Actividades",
    "Alimenatación",
    "Guías",
    "Alojamiento",
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailDto>({
    resolver: zodResolver(emailDtoSchema),
  });

  const handleLogin = (data: EmailDto) => {
    console.log(data);
    // Add your login handling logic here
  };

  return (
    <div className="space-x-1">
      <Button rounded text icon="pi pi-pencil" />
      <Button icon="pi pi-eye" rounded text />
      <Button
        icon="pi pi-file-pdf"
        className=""
        rounded
        text
        disabled={isLoading || !rowData.reservation}
        onClick={() => {
          if (!rowData.reservation) return;
          downloadPdf(rowData?.reservation?.id, "rolando");
        }}
        // disabled={isLoading}
      />
      {type === "principal" && (
        <Button
          icon="pi pi-envelope"
          rounded
          text
          onClick={() => {
            setVisible(true);
          }}
        />
      )}
      <Button icon="pi pi-trash" rounded text severity="danger" />

      {/*  Dialog*/}

      <Dialog
        header="Enviar correo"
        visible={visible}
        style={{ width: "auto", /* border: "4px solid #01A3BB" */ }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <form className={Style.confort} onSubmit={handleSubmit(handleLogin)}>
          <Controller
            name="subject"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                type="text"
                label={{ text: "Asunto" }}
                placeholder="Asunto"
                className="w-full mb-4"
                invalid={!!error}
                {...field}
                small={{
                  text: error?.message,
                  className: "text-red-500",
                }}
              />
            )}
          />

          <div className="mb-6">
            <label
              htmlFor=""
              className="
            
            "
            >
              Para
            </label>

            <Controller
              name="to"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <MultiSelect
                  {...field}
                  options={[
                    { label: "Annelies", value: "Annelies" },
                    { label: "Pablo", value: "Pablo" },
                    { label: "Carmen", value: "Carmen" },
                  ]}
                  multiple
                  filter
                  className="w-full"
                  placeholder="Para"
                  invalid={!!error}
                  onChange={(e) => field.onChange(e.value)}
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  display="chip"
                />
              )}
            />
          </div>

          <div className="mb-6">
            <div>
              <Controller
                name="resources"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <SelectButton
                    label={{ text: "Recursos" }}
                    options={resources}
                    invalid={!!error}
                    {...field}
                    onChange={(e: SelectButtonChangeEvent) =>
                      field.onChange(e.value)
                    }
                    small={{
                      text: error?.message,
                      className: "text-red-500",
                    }}
                  />
                )}
              />
            </div>
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <InputTextarea
                {...field}
                label={{ text: "Descripción ( Opcional )" }}
                rows={5}
                small={{
                  text: error?.message,
                  className: "text-red-500",
                }}
              />
            )}
          />
          <div className="flex justify-end mt-4">
            <Button
              label="Cancelar"
              onClick={() => {
                setVisible(false);
              }}
              icon="pi pi-envelope"
              type="submit"
              className="mr-4 bg-white text-gray-500"
            />

            <Button label="Enviar" icon="pi pi-envelope" type="submit" />
          </div>
        </form>
      </Dialog>
      {/*  Dialog*/}
    </div>
  );
};
