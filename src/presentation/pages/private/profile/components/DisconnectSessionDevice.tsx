import { cn } from "@/core/adapters";
import { regex } from "@/core/constants";
import { useDisconnectDeviceMutation } from "@/infraestructure/store/services";
import { Button, Dialog, Password } from "@/presentation/components";
import { useEffect, useState } from "react";

const { PASSWORD } = regex;

type Props = {
  showModal: boolean;
  setShowModal: (showModal: { show: boolean; deviceId?: string }) => void;
  deviceId?: string;
};

export const DisconnectSessionDevice = ({
  showModal,
  setShowModal,
  deviceId,
}: Props) => {
  const [disconnectDevice] = useDisconnectDeviceMutation();

  const [password, setPassword] = useState<string>("");
  const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

  const handleConfirm = () => {
    if (invalidPassword || !deviceId) return;
    disconnectDevice({
      deviceId: deviceId,
      password,
    }).unwrap()
    .then(() => {
      setShowModal({ show: false, deviceId });
    });
  };

  useEffect(() => {
    if (password.length === 0) return;
    setInvalidPassword(!PASSWORD.test(password));
  }, [password]);

  return (
    <Dialog
      visible={showModal}
      style={{ maxWidth: "300px", maxHeight: "300px" }}
      onHide={() => setShowModal({ show: false, deviceId })}
      footer={
        <Button
          disabled={invalidPassword}
          label="Confirmar"
          onClick={handleConfirm}
        />
      }
    >
      <div>
        <Password
          label={{
            text: "Contraseña",
            className: cn(
              "text-tertiary text-sm font-bold mb-4",
              invalidPassword && "text-error"
            ),
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          feedback={false}
          invalid={invalidPassword}
          toggleMask
          placeholder="Ingresa tu contraseña"
        />
      </div>
    </Dialog>
  );
};
