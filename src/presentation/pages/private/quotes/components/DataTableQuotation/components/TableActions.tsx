import { constantRoutes } from "@/core/constants";
import { EmailDto, emailDtoSchema } from "@/domain/dtos/email";
import {
  UserEntity,
  VersionQuotationStatus,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  useLazyGenerateVersionQuotationPdfQuery,
  useSendMessageEmailMutation,
  useSendMessageMutation,
} from "@/infraestructure/store/services";
import {
  Avatar,
  Badge,
  Button,
  Dialog,
  InputText,
  InputTextarea,
  MultiSelect,
  MultiSelectChangeEvent,
  ProgressSpinner,
  SelectButton,
  SelectButtonChangeEvent,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { AppState } from "@/app/store";
import { useSelector } from "react-redux";

const { EDIT_QUOTE } = constantRoutes.private;

const resources = [
  "Transporte",
  "Actividades",
  "Alimenatación",
  "Guías",
  "Alojamiento",
];

type TyoeTableActions = {
  rowData: VersionQuotationEntity;
  type: "principal" | "secondary";
};

export const TableActions = ({ type, rowData }: TyoeTableActions) => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const { authUser } = useSelector((state: AppState) => state.auth);
  const { users } = useSelector((state: AppState) => state.users);

  const [handleGeneratePdf, { isLoading: isLoadingGeneratePdf }] =
    useLazyGenerateVersionQuotationPdfQuery();

  const [sendMessage] = useSendMessageMutation();
  const [sendMessageEmail, { isLoading: isLoadingEmail }] =
    useSendMessageEmailMutation();

  const { control, handleSubmit } = useForm<EmailDto>({
    resolver: zodResolver(emailDtoSchema),
  });

  
  const handleLogin = async (data: EmailDto) => {
    await sendMessageEmail({
      subject: data.subject,
      to: data.to.map((user) => ({ email: user.email })),
      resources: data.resources,
      description: data.description,
      reservationId: rowData.tripDetails?.id,
    })
      .unwrap()
      

    await sendMessage({
      from_user: authUser?.id as number,
      to_user: data.to.map((user) => user.id!),
      message: data.description as string,
    })
      .unwrap()
      
  };

  const userTemplate = (option: UserEntity) => {
    return (
      <div
        className="
        flex
        items-center
      "
      >
        <Avatar icon="pi pi-user" shape="circle" />
        {
          <Badge
            severity={option.online ? "success" : "danger"}
            className="mx-2"
          />
        }

        <p className="font-bold ">{option.fullname}</p>
      </div>
    );
  };

  return (
    <div className="space-x-1">
      <Button
        rounded
        text
        icon="pi pi-pencil"
        onClick={() => {
          navigate(EDIT_QUOTE(rowData?.id));
        }}
        disabled={
          rowData.status === VersionQuotationStatus.APPROVED && rowData.official
        }
      />

      <Button
        icon="pi pi-file-pdf"
        className=""
        rounded
        text
        disabled={
          isLoadingGeneratePdf ||
          rowData.status === VersionQuotationStatus.DRAFT
        }
        onClick={() => {
          if (!rowData.tripDetails) return;
          handleGeneratePdf({
            id: rowData.id,
            name: rowData?.tripDetails?.client?.fullName || "",
          });
        }}
      />
      {type === "principal" && (
        <Button
          icon="pi pi-envelope"
          rounded
          disabled={!rowData.tripDetails}
          text
          onClick={() => {
            setVisible(true);
          }}
        />
      )}

      {/*  Dialog*/}

      <Dialog
        header="Enviar correo"
        visible={visible}
        style={{ width: "auto" }}
        onHide={() => {
          setVisible(false);
        }}
      >
        <form
          className={"text-tertiary text-[20px] font-bold mb-4"}
          onSubmit={handleSubmit(handleLogin)}
        >
          <Controller
            name="subject"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                type="text"
                label={{
                  text: "Asunto",
                  className: "text-tertiary text-[20px] font-bold ",
                }}
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
                  options={
                    Array.isArray(users)
                      ? users?.map((user) => {
                          return {
                            ...user,
                          };
                        })
                      : []
                  }
                  multiple
                  filter
                  className="w-full"
                  placeholder="Para"
                  invalid={!!error}
                  {...field}
                  onChange={(e: MultiSelectChangeEvent) => {
                    field.onChange(e.value);
                  }}
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  display="chip"
                  optionLabel="fullname"
                  itemTemplate={userTemplate}
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
            {isLoadingEmail ? (
              <ProgressSpinner
                style={{ width: "40px", height: "40px" }}
                strokeWidth="8"
              />
            ) : (
              <>
                <Button
                  label="Cancelar"
                  onClick={() => {
                    setVisible(false);
                  }}
                  icon="pi pi-envelope"
                  type="submit"
                  className="mr-4 bg-white text-gray-500"
                />
                <Button
                  label="Enviar"
                  icon="pi pi-envelope"
                  type="submit"
                  disabled={isLoadingEmail}
                />
              </>
            )}
          </div>
        </form>
      </Dialog>
      {/*  Dialog*/}
    </div>
  );
};
