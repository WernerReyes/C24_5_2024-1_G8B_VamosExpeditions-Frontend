import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { AuthFormLayout } from "../layouts";
import { resetPasswordDto, ResetPasswordDto } from "@/domain/dtos/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { CountdownCircleTimer, Password } from "@/presentation/components";
import {
  useResetPasswordMutation,
  useVerifyResetPasswordTokenQuery,
} from "@/infraestructure/store/services";
import { useNavigate, useParams } from "react-router-dom";
import { constantRoutes } from "@/core/constants";
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordDto>({
    resolver: zodResolver(resetPasswordDto.getSchema),
    defaultValues: resetPasswordDto.getDefault({
      token,
    }),
  });

  const [decodedToken, setDecodedToken] = useState<JwtPayload | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [timeOut, setTimeout] = useState(false);

  const { isError, isFetching } = useVerifyResetPasswordTokenQuery(token!, {
    skip: !token || decodedToken?.exp! > Date.now() / 1000,
    refetchOnMountOrArgChange: true,
  });

  const [resetPassword, { isLoading: isResettingPassword }] =
    useResetPasswordMutation();

  const handleResetPassword = async (data: ResetPasswordDto) => {
    await resetPassword(data)
      .unwrap()
      .then(async () => {
        setTimeout(true);
      });
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
        setRemainingTime(
          (function () {
            const now = Math.floor(Date.now() / 1000); 
            const exp = decoded?.exp;
            const diff = (exp ?? 0) - now;
            return diff;
          })()
        );
      } catch (error) {
        setDecodedToken(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (
      isError ||
      !token ||
      decodedToken?.exp! < Date.now() / 1000 ||
      timeOut
    ) {
      navigate(constantRoutes.public.LOGIN);
    }
  }, [isError, decodedToken, token, timeOut]);

  if (isFetching || !decodedToken?.iat || !decodedToken?.exp) return null;
  return (
    <AuthFormLayout
      title="Cambiar Contraseña"
      description="Ingresa tu nueva contraseña"
      handleSubmit={handleSubmit(handleResetPassword)}
      loading={isResettingPassword}
      disabled={Object.keys(errors).length > 0 || timeOut}
      buttonLabel="Cambiar Contraseña"
    >
      <div className="mx-auto">
        <CountdownCircleTimer
          isPlaying
          duration={decodedToken.exp - decodedToken.iat}
          colors={["#01495d", "#01a3bb", "#f4f6f6"]}
          colorsTime={[7, 5, 2]}
          size={100}
          initialRemainingTime={remainingTime}
          strokeWidth={5}
          trailStrokeWidth={5}
          trailColor="#d9d9d9"
          strokeLinecap="round"
          onComplete={() => {
            setTimeout(true);
          }}
        >
          {({ remainingTime }) => (
            <div className="flex flex-col items-center justify-center">
              <i className="pi pi-stopwatch text-primary mb-1"></i>
              <span className={`text-xl font-semibold text-vamos-text`}>
                {children({ remainingTime })}
              </span>
            </div>
          )}
        </CountdownCircleTimer>
      </div>

      <div className="mt-5">
        <Controller
          control={control}
          name="newPassword"
          defaultValue="aLTEC123488777@"
          render={({ field, fieldState: { error } }) => (
            <Password
              label={{
                htmlFor: "newPassword",
                text: "Nueva Contraseña",
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
    </AuthFormLayout>
  );
};

export default ResetPasswordPage;

const children = ({ remainingTime }: { remainingTime: number }) => {
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
