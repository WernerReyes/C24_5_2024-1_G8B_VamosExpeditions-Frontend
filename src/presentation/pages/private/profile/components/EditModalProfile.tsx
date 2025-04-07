import { AppState } from "@/app/store";
import { userDto, type UserDto } from "@/domain/dtos/user";
import { useUpsertUserMutation } from "@/infraestructure/store/services";
import { Button, Dialog, InputText } from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";

import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

type Props = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

export const EditModalProfile = ({ setShowModal, showModal }: Props) => {
  const { authUser } = useSelector((state: AppState) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<UserDto>({
    resolver: zodResolver(userDto.getSchema),
    defaultValues: userDto.getDefault(authUser),
  });

  const [upsertUser, { isLoading }] = useUpsertUserMutation();

  const handleUpsertUser = async (data: UserDto) => {
    upsertUser(data)
      .unwrap()
      .then(() => setShowModal(false));
  };

  return (
    <Dialog
      header="Editar Perfil"
      visible={showModal}
      style={{ width: "50vw" }}
      onHide={() => setShowModal(false)}
    >
      <form
        onSubmit={handleSubmit(handleUpsertUser)}
        className="flex flex-col gap-y-4"
        noValidate
      >
        <div>
          <Controller
            control={control}
            name="fullname"
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
                placeholder="Nombre completo"
                className="w-full"
                invalid={!!error}
                {...field}
              />
            )}
          />
        </div>

        <div>
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
                className="w-full"
                id="email"
                invalid={!!error}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="phoneNumber"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={{
                  htmlFor: "Número de teléfono",
                  text: "Telefono ( +51999999999 )",
                }}
                type="text"
                small={{
                  text: error?.message,
                }}
                placeholder="Número de teléfono"
                className="w-full"
                invalid={!!error}
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Controller
            control={control}
            name="description"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <InputText
                label={{
                  htmlFor: "Descripción",
                  text: "Descripción",
                }}
                type="text"
                small={{
                  text: error?.message,
                }}
                placeholder="Descripción"
                className="w-full"
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
            label="Guardar"
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
