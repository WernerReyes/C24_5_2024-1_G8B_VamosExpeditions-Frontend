import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginDto, type LoginDto } from "@/domain/dtos/auth";
import { Button, Image, InputText, Password } from "@/presentation/components";
import { constantRoutes } from "@/core/constants";
import { useLoginMutation } from "@/infraestructure/store/services";
import { useCookieExpirationStore } from "@/infraestructure/hooks";

const { DASHBOARD } = constantRoutes.private;

const LoginPage = () => {
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

  const handleLogin = async (loginDto: LoginDto) => {
    await login(loginDto)
      .unwrap()
      .then(({ data }) => {
        navigate(DASHBOARD);
        init(data.expiresAt);
      });
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="bg-login bg-no-repeat bg-cover bg-center w-screen min-h-screen flex justify-center items-center"
    >
      <div className="mx-10 w-80 bg-secondary px-8 py-16 rounded-lg shadow-lg sm:w-[25rem]">
        <Image src="/images/logo.png" alt="Logo" className="mx-auto" />
        <h1
          id="login-heading"
          className="text-2xl mt-7 font-bold text-center mb-1 text-tertiary"
        >
          Bienvenido de nuevo
        </h1>
        <p className="text-center font-light text-sm mb-6">
          Ingresa tus credenciales para acceder a tu cuenta
        </p>
        <form
          className="flex flex-col"
          onSubmit={handleSubmit(handleLogin)}
          noValidate
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
                  inputClassName="mt-2 block w-full sm:w-[21rem]"
                  placeholder="Contraseña"
                  toggleMask
                  invalid={!!error}
                  {...field}
                />
              )}
            />
          </div>

          <Button
            type="submit"
            label={isLoggingIn ? "Validando..." : "Iniciar Sesión"}
            disabled={Object.keys(errors).length > 0 || isLoggingIn}
            // onClick={handleSubmit}
            className="w-full mt-8"
          />
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
