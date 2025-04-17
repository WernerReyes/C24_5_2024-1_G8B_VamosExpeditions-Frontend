import { Controller, useForm } from "react-hook-form";
import { AuthFormLayout } from "../layouts";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "@/presentation/components";
import { useSendResetPasswordEmailMutation } from "@/infraestructure/store/services";
import { useState } from "react";

const ForgetPasswordPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{
    email: string;
  }>({
    resolver: zodResolver(
      z.object({
        email: z
          .string()
          .min(1, {
            message: "El correo electrónico es requerido",
          })
          .email("Correo electrónico inválido"),
      })
    ),
  });

  const [sendResetPasswordEmail, { isLoading: isSendingEmail }] =
    useSendResetPasswordEmailMutation();

  const [emailSent, setEmailSent] = useState(false);

  const handleSendEmail = async (data: { email: string }) => {
    await sendResetPasswordEmail(data.email)
      .unwrap()
      .then(() => {
        setEmailSent(true);
      });
  };

  return (
    <AuthFormLayout
      title="Recuperar Contraseña"
      description="Ingresa tu correo electrónico para recuperar tu contraseña"
      handleSubmit={handleSubmit(handleSendEmail)}
      loading={isSendingEmail}
      disabled={Object.keys(errors).length > 0 || emailSent}
      buttonLabel="Recuperar Contraseña"
    >
      {!emailSent ? (
        <Controller
          control={control}
          name="email"
          defaultValue=""
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
      ) : (
        <>
          <p className="text-center text-sm font-light text-tertiary">
            Se ha enviado un correo electrónico con instrucciones para
            restablecer su contraseña.
          </p>
          <p className="text-center text-sm font-light text-tertiary">
            Si no ves el correo electrónico, revisa tu carpeta de spam o correo
            no deseado.
          </p>

          <p className="text-center text-sm font-light text-tertiary">
            Si no recibiste el correo electrónico, puedes volver a solicitarlo.
          </p>
        </>
      )}
    </AuthFormLayout>
  );
};

export default ForgetPasswordPage;
