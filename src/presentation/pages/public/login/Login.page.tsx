import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginDto, type LoginDto } from "@/domain/dtos/auth";
import { Avatar, InputText, Password } from "@/presentation/components";
import { constantRoutes } from "@/core/constants";
import { useLoginMutation } from "@/infraestructure/store/services";
import { useCookieExpirationStore } from "@/infraestructure/hooks";
import { AuthFormLayout } from "../layouts";
import { useSelector } from "react-redux";
import { AppState } from "@/app/store";
import { useState } from "react";

const { DASHBOARD } = constantRoutes.private;
const { FORGET_PASSWORD, TWO_FACTOR_AUTHENTICATION } = constantRoutes.public;

const LoginPage = () => {
  const { authUser } = useSelector((state: AppState) => state.auth);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginDto.getSchema),
  });
  const navigate = useNavigate();
  const { init } = useCookieExpirationStore();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [isMounted, setIsMounted] = useState(false);

  const handleLogin = async (loginDto: LoginDto) => {
    await login(loginDto)
      .unwrap()
      .then(({ data }) => {
        if ("require2FA" in data) {
          window.location.href = TWO_FACTOR_AUTHENTICATION(data.tempToken);
          return;
        }

        navigate(DASHBOARD);
        init(data.expiresAt);

        new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        setIsMounted(true);
      });
  };

  if (isMounted) return null;

  if (authUser && !isLoggingIn) {
    return (
      <AuthFormLayout
        title="Bienvenido de nuevo"
        description="Tu sesión ya ha sido iniciada"
        handleSubmit={() => navigate(DASHBOARD)}
        loading={false}
        disabled={false}
        buttonLabel="Ir a Dashboard"
      >
        <div className="flex flex-col items-center">
          <Avatar
            size="xlarge"
            className="mb-4 size-40 text-6xl"
            shape="circle"
            label={authUser.fullname}
          />
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Bienvenido de nuevo"
      description="Ingresa tus credenciales para acceder a tu cuenta"
      handleSubmit={handleSubmit(handleLogin)}
      loading={isLoggingIn}
      disabled={Object.keys(errors).length > 0}
      buttonLabel="Iniciar Sesión"
    >
      <Controller
        control={control}
        name="email"
        defaultValue="test1@google.com"
        render={({ field, fieldState: { error } }) => (
          <InputText
            label={{
              htmlFor: "email",
              text: "Correo Electrónico",
              className: "text-tertiary font-bold mb-2",
            }}
            small={{
              text: error?.message,
              className: "text-red-500",
            }}
            iconField
            iconFieldProps={{
              iconPosition: "left",
            }}
            iconProps={{
              className: "pi pi-envelope",
            }}
            id="email"
            className="block w-full"
            placeholder="Correo Electrónico"
            invalid={!!error}
            {...field}
          />
        )}
      />

      <div className="mt-5">
        <Controller
          control={control}
          name="password"
          defaultValue="aLTEC1234@"
          render={({ field, fieldState: { error } }) => (
            <Password
              label={{
                htmlFor: "password",
                text: "Contraseña",
                className: "text-tertiary font-bold",
              }}
              small={{
                text: error?.message,
                className: "text-red-500",
              }}
              feedback={false}
              placeholder="Contraseña"
              toggleMask
              invalid={!!error}
              {...field}
            />
          )}
        />
      </div>

      <div className="flex justify-end mt-5">
        <Link to={FORGET_PASSWORD} className="text-sm text-tertiary font-bold">
          Olvidé mi contraseña
        </Link>
      </div>
    </AuthFormLayout>
  );
};

export default LoginPage;
