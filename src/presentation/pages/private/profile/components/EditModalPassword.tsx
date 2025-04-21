import type { AppState } from "@/app/store";
import { changePasswordDto, type ChangePasswordDto } from "@/domain/dtos/user";
import { useChangePasswordMutation } from "@/infraestructure/store/services";
import { Button, Dialog, Password } from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const EditModalPassword = ({ setShowModal, showModal }: Props) => {
  const { authUser } = useSelector((state: AppState) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<ChangePasswordDto>({
    resolver: zodResolver(changePasswordDto.getSchema),
    defaultValues: changePasswordDto.getDefault(authUser!),
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (data: ChangePasswordDto) => {
    changePassword(data)
      .unwrap()
      .then(() => setShowModal(false));
  };
  return (
    <Dialog
      header="Editar Perfil"
      visible={showModal}
      style={{
        width: "50vw",
      }}
      onHide={() => setShowModal(false)}
    >
      <form
        onSubmit={handleSubmit(handleChangePassword)}
        className="flex flex-col gap-y-4 mt-5"
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="oldPassword"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <Password
                label={{
                  htmlFor: "Contraseña actual",
                  text: "Contraseña actual",
                }}
                type="text"
                small={{
                  text: error?.message,
                  className: "text-red-500",
                }}
                placeholder="Contraseña actual"
                toggleMask
               
                feedback={false}
                invalid={!!error}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="newPassword"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <Password
                label={{
                  htmlFor: "Nueva contraseña",
                  text: "Nueva contraseña",
                }}
                type="email"
                small={{
                  text: error?.message,
                  className: "text-red-500",
                }}
                placeholder="Nueva contraseña"
               
                toggleMask
                feedback={false}
                invalid={!!error}
                {...field}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            label="Cancelar"
            outlined
            type="button"
            onClick={() => setShowModal(false)}
          />
          <Button
            label="Cambiar contraseña"
            type="submit"
            className="bg-primary"
            disabled={!isDirty}
            loading={isLoading}
          />
        </div>
      </form>
    </Dialog>
  );
};
