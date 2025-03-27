import { useState, useEffect } from "react";
import { Dialog } from "../Dialog";
import { constantRoutes } from "@/core/constants";
import { ProgressBar } from "../ProgressBar";
import { Button } from "../Button";
import { Card } from "../Card";
import { useReLoginMutation } from "@/infraestructure/store/services";

const { LOGIN } = constantRoutes.public;

const sessionChannel = new BroadcastChannel("session"); // Shared channel

interface ExpiredSessionCountdownProps {
  countdownDuration?: number;
  isExpired: boolean;
}

export function ExpiredSessionCountdown({
  countdownDuration = 60,
  isExpired,
}: ExpiredSessionCountdownProps) {
  const [reLogin] = useReLoginMutation();
  const [timeLeft, setTimeLeft] = useState(countdownDuration);

  const handleRedirect = () => (window.location.href = LOGIN);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleRedirect();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const progressValue = ((timeLeft / countdownDuration) * 100).toFixed(0);

  return (
    <Dialog
      closable={false}
      visible={isExpired}
      className="w-fit"
      style={{ width: "50vw" }}
      onHide={() => {}}
    >
      <Card
        className="border-none shadow-none"
        title={
          <div className="flex items-center flex-col justify-center text-primary gap-2">
            <i className="pi pi-exclamation-triangle text-4xl" />
            <h5 className="flex items-center justify-center gap-2">
              Sesión expirada
            </h5>
          </div>
        }
        footer={
          <Button
            label="Iniciar sesión"
            icon="pi pi-sign-in"
            className="w-full mt-3"
            onClick={() =>
              reLogin()
                .unwrap()
                .then(() => sessionChannel.postMessage("relogged"))
            }
          />
        }
      >
        <p className="text-muted-foreground">
          Su sesión ha expirado. Por favor, vuelva a iniciar sesión
        </p>

        <ProgressBar value={progressValue} className="mt-2" />
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Redireccionando en {timeLeft} segundos...
        </p>
      </Card>
    </Dialog>
  );
}
