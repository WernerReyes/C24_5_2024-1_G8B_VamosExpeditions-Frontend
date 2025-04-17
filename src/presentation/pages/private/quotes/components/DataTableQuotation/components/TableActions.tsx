import { constantRoutes } from "@/core/constants";
import {
  UserEntity,
  VersionQuotationStatus,
  type VersionQuotationEntity,
} from "@/domain/entities";
import {
  notificationSocket,
  useLazyGenerateVersionQuotationPdfQuery,
  useSendEmailAndGenerateReportMutation,
} from "@/infraestructure/store/services";
import {
  Avatar,
  Button,
  Dialog,
  InputText,
  InputTextarea,
  MultiSelect,
  MultiSelectChangeEvent,
  ProgressSpinner,
  SelectButton,
  type SelectButtonChangeEvent,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import type { AppState } from "@/app/store";
import { useSelector } from "react-redux";
import { allowVersionQuotationTypesRender } from "@/domain/entities";
import {
  sendEmailAndGenerateReportDto,
  type SendEmailAndGenerateReportDto,
} from "@/domain/dtos/versionQuotation";

const { EDIT_QUOTE } = constantRoutes.private;

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

  const [
    sendEmailAndGenerateReport,
    { isLoading: isLoadingSendEmailAndGenerateReport },
  ] = useSendEmailAndGenerateReportMutation();

  const { control, handleSubmit, setValue } =
    useForm<SendEmailAndGenerateReportDto>({
      resolver: zodResolver(sendEmailAndGenerateReportDto.schema),
    });

  const handleLogin = async (data: SendEmailAndGenerateReportDto) => {
    await sendEmailAndGenerateReport({
      subject: data.subject,
      to: data.to.map((user) => ({ email: user.email })),
      resources: data.resources,
      description: data.description,
      versionQuotationId: data.versionQuotationId,
      from: data.from,
    }).unwrap();

    notificationSocket.sendNotification({
      from_user: authUser?.id as number,
      to_user: data.to.map((user) => user.id!),
      message: data.description as string,
    });
  };

  const userTemplate = (option: UserEntity) => {
    return (
      <div
        className="
        flex
        items-center gap-x-3
      "
      >
        <Avatar
          badge={{
            severity: option.online ? "success" : "danger",
          }}
          icon="pi pi-user"
          shape="circle"
        />

        <p className="font-bold ">{option.fullname}</p>
      </div>
    );
  };

  useEffect(() => {
    setValue("from", authUser?.email || "");
    setValue("versionQuotationId", rowData.id);
  }, [authUser, rowData]);

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
                    users.filter((user) => user.id !== authUser?.id) || []
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
                render={({ field, fieldState: { error } }) => {
                  return (
                    <SelectButton
                      label={{ text: "Recursos" }}
                      options={Object.values(allowVersionQuotationTypesRender)}
                      optionLabel="label"
                      optionValue="value"
                      invalid={!!error}
                      {...field}
                      onChange={(e: SelectButtonChangeEvent) =>
                        field.onChange(e.value)
                      }
                      itemTemplate={(option) => {
                        return (
                          <div className="flex items-center gap-x-2">
                            <i className={option.icon} />
                            <span>{option.label}</span>
                          </div>
                        );
                      }}
                      small={{
                        text: error?.message,
                        className: "text-red-500",
                      }}
                    />
                  );
                }}
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
            {isLoadingSendEmailAndGenerateReport ? (
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
                  disabled={isLoadingSendEmailAndGenerateReport}
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
