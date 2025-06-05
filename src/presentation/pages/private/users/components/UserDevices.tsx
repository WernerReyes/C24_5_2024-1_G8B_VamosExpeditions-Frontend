import { cn } from "@/core/adapters";
import type { UserEntity } from "@/domain/entities";
import {
  DeviceConnection
} from "@/infraestructure/store/services/auth/auth.response";
import { Avatar, Button, Tooltip } from "@/presentation/components";
import { FieldNotAssigned } from "../../components";

type Props = {
  userId: UserEntity["id"];
  activeDevices?: DeviceConnection[];
};
export const UserDevices = ({ activeDevices, userId }: Props) => {
  if (!activeDevices || activeDevices.length === 0)
    return <FieldNotAssigned message="Ningún dispositivo conectado" />;

  const devicesMovile = activeDevices.filter(
    (device) => device.model === "Android" || device.model === "iOS"
  );

  const devicesTablet = activeDevices.filter(
    (device) => device.model === "Tablet"
  );

  const devicesDesktop = activeDevices.filter(
    (device) =>
      device.model === "Windows" ||
      device.model === "MacOS" ||
      device.model === "Linux"
  );

  return (
    <div className="flex gap-2 items-center justify-center">
      <DeviceTooltip
        devices={devicesMovile}
        target={`mobile-devices-${userId}`}
        icon="pi pi-mobile"
      />
      <DeviceTooltip
        devices={devicesTablet}
        target={`tablet-devices-${userId}`}
        icon="pi pi-tablet"
      />
      <DeviceTooltip
        devices={devicesDesktop}
        target={`desktop-devices-${userId}`}
        icon="pi pi-desktop"
      />
    </div>
  );
};

type DeviceTooltipProps = {
  devices: DeviceConnection[];
  target: string;
  icon: string;
};

const DeviceTooltip = ({ devices, target, icon }: DeviceTooltipProps) => {
  return (
    <>
      <Tooltip target={`.${target}`} position="top">
        <div className="flex flex-col gap-2 justify-center">
          {devices.map((device) => {
            return (
              <div key={device.id} className="flex items-center gap-1">
                <Avatar
                  icon={icon}
                  badge={{
                    className: cn(
                      "top-1 right-1",
                      device.isOnline ? "bg-green-500" : "bg-red-500"
                    ),
                  }}
                  className="bg-transparent"
                />

                <span className="text-sm font-bold">{`${device.model} - ${device.name}`}</span>
              </div>
            );
          })}
        </div>
      </Tooltip>
      <Button
        rounded
        text
        icon={icon}
        className={cn(
          target,
          "custom-tooltip-btn",
          "p-button-sm p-button-outlined",
          devices.length > 0 ? "" : "hidden"
        )}
      />
    </>
  );
};
