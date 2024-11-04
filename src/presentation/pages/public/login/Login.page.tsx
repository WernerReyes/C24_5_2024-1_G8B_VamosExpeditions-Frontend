import { LoginRequest } from "@/domain/dtos/requests/auth";
import {
  Button,
  Image,
  InputText,
  Password,
  toastAdapter,
  Toaster,
} from "@/presentation/components";
import { Controller, useForm } from "react-hook-form";

const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const handleLogin = async (data: LoginRequest) => {
    console.log(data);
    // toastAdapter.loading("Iniciando sesión...");
    try {
      // const response = await authService.login(loginRequest);
      // if (response) {
      //   toastAdapter.success("Inicio de sesión exitoso");
      //   router.push("/dashboard");
      // }
    } catch (error) {
      // toastAdapter.error(error.message);
    }
  };

  console.log(errors);

  return (
    <section
      aria-labelledby="login-heading"
      className="bg-login bg-no-repeat bg-cover bg-center w-screen min-h-screen flex justify-center items-center"
    >
      <Toaster />
      <div className="mx-10 w-80 bg-secondary px-8 py-16 rounded-lg shadow-lg sm:w-[25rem]">
        <Image src="/images/logo.png" alt="Logo" className="mx-auto" />
        <h1
          id="login-heading"
          className="text-2xl mt-7 font-bold text-center mb-1 text-tertiary"
        >
          Bienvenid de nuevo
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
            render={({ field }) => (
              <InputText
                label={{
                  htmlFor: "email",
                  text: "Correo Electrónico",
                  className: "text-tertiary font-bold mb-2",
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
                // invalid
                {...field}
              />
            )}
          />

          {/* <InputText
            label={{
              htmlFor: "email",
              text: "Correo Electrónico",
              className: "text-tertiary font-bold mb-2",
            }}
            iconField
            iconFieldProps={{
              iconPosition: "left",
            }}
            iconProps={{
              className: "pi pi-envelope",
            }}
            id="email"
            name="email"
            className="block w-full"
            placeholder="Correo Electrónico"
            // invalid
          /> */}

          <div className="mt-5">
            <Password
              label={{
                htmlFor: "password",
                text: "Contraseña",
                className: "text-tertiary font-bold",
              }}
              name="password"
              feedback={false}
              inputClassName="mt-2 block w-full sm:w-[21rem]"
              placeholder="Contraseña"
              toggleMask
            />
          </div>

          <Button
            type="submit"
            label="Ingresar"
            // onClick={handleSubmit}
            className="w-full mt-8"
          />
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
