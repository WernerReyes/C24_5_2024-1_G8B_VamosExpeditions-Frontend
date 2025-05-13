import { AppState } from "@/app/store";
import {
  sendEmailAndGenerateReportDto,
  type SendEmailAndGenerateReportDto,
} from "@/domain/dtos/versionQuotation";
import {
  allowVersionQuotationTypesRender,
  type UserEntity,
  type VersionQuotationEntity,
} from "@/domain/entities";
import { setNewLimit } from "@/infraestructure/store";
import {
  notificationSocket,
  useSendEmailAndGenerateReportMutation,
} from "@/infraestructure/store/services";
import {
  Button,
  Dialog,
  InputText,
  InputTextarea,
  MultiSelect,
  type MultiSelectChangeEvent,
  ProgressSpinner,
  SelectButton,
  type SelectButtonChangeEvent,
} from "@/presentation/components";
import { UserInfo } from "@/presentation/pages/private/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  rowData: VersionQuotationEntity;
};

export const SendReportToEmailDialog = ({ rowData }: Props) => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state: AppState) => state.auth);
  const { usersPagination, isLoadingUsers } = useSelector(
    (state: AppState) => state.users
  );
  const { control, handleSubmit, setValue } =
    useForm<SendEmailAndGenerateReportDto>({
      resolver: zodResolver(sendEmailAndGenerateReportDto.schema),
    });

  const [
    sendEmailAndGenerateReport,
    { isLoading: isLoadingSendEmailAndGenerateReport },
  ] = useSendEmailAndGenerateReportMutation();

  const [visible, setVisible] = useState(false);

  const handleSendEmail = async (data: SendEmailAndGenerateReportDto) => {
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

  useEffect(() => {
    setValue("from", authUser?.email || "");
    setValue("versionQuotationId", rowData.id);
  }, [authUser, rowData]);

  return (
    <>
      <Button
        icon="pi pi-envelope"
        tooltip="Enviar correo"
        rounded
        disabled={!rowData.tripDetails}
        text
        onClick={() => {
          setVisible(true);
        }}
      />
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
          onSubmit={handleSubmit(handleSendEmail)}
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
                    usersPagination.content.filter(
                      (user) => user.id !== authUser?.id
                    ) || []
                  }
                  multiple
                  filter
                  loading={isLoadingUsers}
                  className="w-full"
                  placeholder="Para"
                  invalid={!!error}
                  {...field}
                  onChange={(e: MultiSelectChangeEvent) => {
                    field.onChange(e.value);
                  }}
                  panelFooterTemplate={() => {
                    return (
                      <div className="flex justify-center items-center gap-2 p-2">
                        {isLoadingUsers && (
                          <span className="text-primary">Cargando...</span>
                        )}
                        {!isLoadingUsers && (
                          <button
                            type="button"
                            disabled={
                              usersPagination.limit >= usersPagination.total
                            }
                            className="text-primary hover:underline disabled:opacity-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setNewLimit());
                            }}
                          >
                            Cargar más
                          </button>
                        )}
                      </div>
                    );
                  }}
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  display="chip"
                  optionLabel="fullname"
                  itemTemplate={(user: UserEntity) => <UserInfo user={user} />}
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
    </>
  );
};
