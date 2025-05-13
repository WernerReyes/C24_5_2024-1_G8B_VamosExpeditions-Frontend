import { fromDeviceIdToObject } from "@/core/utils";
import { FieldNotAssigned } from "../../components";
import { Avatar, Button, Tooltip } from "@/presentation/components";
import { cn } from "@/core/adapters";
import type { UserEntity } from "@/domain/entities";

type Props = {
    userId: UserEntity["id"];
  activeDevices?: {
    deviceId: string;
    isOnline: boolean;
  }[];
};
export const UserDevices = ({ activeDevices, userId }: Props) => {
  if (!activeDevices || activeDevices.length === 0)
    return <FieldNotAssigned message="Ningún dispositivo conectado" />;

  const devicesMovile = activeDevices.filter(
    (device) =>
      fromDeviceIdToObject(device.deviceId).platform === "Android" ||
      fromDeviceIdToObject(device.deviceId).platform === "iOS"
  );

  const devicesTablet = activeDevices.filter(
    (device) => fromDeviceIdToObject(device.deviceId).platform === "iOS"
  );

  const devicesDesktop = activeDevices.filter(
    (device) =>
      fromDeviceIdToObject(device.deviceId).platform === "Windows" ||
      fromDeviceIdToObject(device.deviceId).platform === "MacOS" ||
      fromDeviceIdToObject(device.deviceId).platform === "Linux"
  );

  if (!devicesMovile.length && !devicesTablet.length && !devicesDesktop.length)
    return <FieldNotAssigned message="Ningún dispositivo conectado" />;

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
  devices: {
    deviceId: string;
    isOnline: boolean;
  }[];
  target: string;
  icon: string;
};

const DeviceTooltip = ({ devices, target, icon }: DeviceTooltipProps) => {
  return (
    <>
      <Tooltip target={`.${target}`} position="top">
        <div className="flex flex-col gap-2 justify-center">
          {devices.map((device) => {
            const { browser, platform } = fromDeviceIdToObject(device.deviceId);
            return (
              <div key={device.deviceId} className="flex items-center gap-1">
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

                <span className="text-sm font-bold">{`${browser} - ${platform}`}</span>
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
