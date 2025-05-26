import { createUserDto, type CreateUserDto } from "@/domain/dtos/user";
import { type RoleEntity, roleRender } from "@/domain/entities";
import {
  useCreateUserMutation,
  useGetRolesQuery,
} from "@/infraestructure/store/services";
import {
  Button,
  DefaultFallBackComponent,
  Dialog,
  Dropdown,
  ErrorBoundary,
  InputText,
  InputTextarea,
  Tag,
} from "@/presentation/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateUserDialog = ({ open, onClose }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isLoading: isFieldsLoading },
  } = useForm<CreateUserDto>({
    resolver: zodResolver(createUserDto.schema),
  });

  const { currentData, isLoading, refetch, isFetching, isError } =
    useGetRolesQuery({
      limit: 5,
      page: 1,
      select: {
        id_role: true,
        name: true,
      },
    });

  const [createUser, { isLoading: isCreateUserLoading }] =
    useCreateUserMutation();

  const roles = currentData?.data?.content ?? [];

  const handleCreateUser = async (createUserDto: CreateUserDto) => {
    await createUser(createUserDto)
      .unwrap()
      .then(() => {
        onClose();
      });
  };

  return (
    <Dialog header="Crear usuario" visible={open} onHide={onClose}>
      <form
        onSubmit={handleSubmit(handleCreateUser)}
      >
        <div className="md:flex gap-4">
          <div className="flex w-full flex-col gap-y-2">
            <Controller
              control={control}
              name="fullname"
              render={({ field, fieldState: { error } }) => (
                <InputText
                  {...field}
                  className="w-full"
                  label={{
                    text: "Nombres completos",
                    htmlFor: field.name,
                    className: "text-tertiary font-bold",
                  }}
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  invalid={!!error?.message}
                  placeholder="Ingrese el nombre completo"
                />
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState: { error } }) => (
                <InputText
                  {...field}
                  className="w-full"
                  label={{
                    text: "Correo",
                    htmlFor: field.name,
                    className: "text-tertiary font-bold",
                  }}
                  placeholder="Ingrese el correo eléctronico"
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  invalid={!!error?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="md:flex gap-4 md:mt-5">
          <div className="flex w-full flex-col gap-y-2">
            <Controller
              control={control}
              name="phoneNumber"
              render={({ field, fieldState: { error } }) => (
                <InputText
                  {...field}
                  className="w-full"
                  label={{
                    text: "Telefono (+99..) 999999999",
                    htmlFor: field.name,
                    className: "text-tertiary font-bold",
                  }}
                  placeholder="Ingrese el número de telefono"
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  invalid={!!error?.message}
                />
              )}
            />
          </div>
          <div className="flex w-full flex-col gap-y-2">
            <ErrorBoundary
              isLoader={isLoading}
              skeleton={{
                height: "3rem",
              }}
              fallBackComponent={
                <DefaultFallBackComponent
                  isFetching={isFetching}
                  isLoading={isLoading}
                  refetch={refetch}
                  message="No se ha podido cargar los roles"
                />
              }
              error={isError}
            >
              <Controller
                control={control}
                name="roleId"
                defaultValue={2}
                render={({ field, fieldState: { error } }) => (
                  <Dropdown
                    {...field}
                    options={roles}
                    label={{
                      text: "Rol",
                      htmlFor: field.name,
                      className: "text-tertiary font-bold",
                    }}
                    placeholder="Escoge un rol"
                    optionValue="id"
                    optionLabel="name"
                    small={{
                      text: error?.message,
                      className: "text-red-500",
                    }}
                    pt={{
                      input: {
                        className: "min-h-12",
                      },
                    }}
                    checkmark
                    invalid={!!error?.message}
                    loading={isLoading}
                    valueTemplate={(role: RoleEntity) => {
                      if (!role) return undefined;
                      const { severity, icon, label } = roleRender[role.name];
                      return (
                        <Tag severity={severity} icon={icon} value={label} />
                      );
                    }}
                    itemTemplate={(role: RoleEntity) => {
                      const { severity, icon, label } = roleRender[role.name];
                      return (
                        <Tag severity={severity} icon={icon} value={label} />
                      );
                    }}
                  />
                )}
              />
            </ErrorBoundary>
          </div>
        </div>

        <div className="md:flex gap-4 md:mt-5">
          <div className="flex w-full flex-col gap-y-2">
            <Controller
              control={control}
              name="description"
              render={({ field, fieldState: { error } }) => (
                <InputTextarea
                  {...field}
                  className="w-full"
                  label={{
                    text: "Descripción",
                    htmlFor: field.name,
                    className: "text-tertiary font-bold",
                  }}
                  rows={3}
                  placeholder="Ingrese la descripción"
                  small={{
                    text: error?.message,
                    className: "text-red-500",
                  }}
                  invalid={!!error?.message}
                />
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          label={isCreateUserLoading ? "Creando usuario..." : "Crear usuario"}
          icon="pi pi-check"
          className="mt-5 w-1/3"
          loading={isLoading || isFieldsLoading || isCreateUserLoading}
          disabled={!!Object.keys(errors).length}
        />
      </form>
    </Dialog>
  );
};
