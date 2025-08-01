import React, { useEffect, useState } from "react";
import {
  Dialog,
  Dropdown,
  InputSwitch,
  Button,
} from "@/presentation/components";
import {
  useGetByKeyQuery,
  useUpdateDinamicCleanUpMutation,
  useUpdateMaxActiveSessionsMutation,
  useUpdateTwoFactorAuthMutation,
} from "@/infraestructure/store/services";
import { SettingEntity, SettingKeyEnum } from "@/domain/entities";
import { useSelector } from "react-redux";
import type { AppState } from "@/app/store";
import {
  messageTimestamp,
  startShowError,
  startShowSuccess,
} from "@/core/utils";
import { UserInfo } from "../../components";
import { cn, dateFnsAdapter } from "@/core/adapters";
import { DisconnectSessionDevice } from "./DisconnectSessionDevice";

interface Props {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const DEVICES_LIMIT = [3, 5, 10, Infinity]; //* Infinity = no limit

const CLEANUP_INTERVAL = [7, 15, 30, 60]; //* Days

export const AdvancedSettingDialog: React.FC<Props> = ({
  showModal,
  setShowModal,
}) => {
  const { isManager, authUser, currentDeviceKey } = useSelector(
    (state: AppState) => state.auth
  );

  const { data } = useGetByKeyQuery(SettingKeyEnum.DATA_CLEANUP_PERIOD, {
    skip: !isManager,
  });

  const [updateTwoFactorAuth, { isLoading: isLoadingUpdateTwoFactorAuth }] =
    useUpdateTwoFactorAuthMutation();

  const [updateDinamicCleanUp, { isLoading: isLoadingUpdateDinamicCleanUp }] =
    useUpdateDinamicCleanUpMutation();

  const [
    updateMaxActiveSessions,
    { isLoading: isLoadingUpdateMaxActiveSessions },
  ] = useUpdateMaxActiveSessionsMutation();

  const [twoFactorAuth, setTwoFactorAuth] = useState<{
    id?: number;
    value: boolean;
    currentValue: boolean;
    isChange?: boolean;
  }>({
    value: false,
    currentValue: false,
  });

  const [maxActiveSessionSetting, setMaxActiveSessionSetting] = useState<{
    id?: number;
    value: number;
    currentValue: number;
    isChange?: boolean;
  }>({
    value: DEVICES_LIMIT[0],
    currentValue: DEVICES_LIMIT[0],
  });

  const {
    id: deviceLimitID,
    isChange: isChangeDeviceLimit,
    value: devicesLimit,
  } = maxActiveSessionSetting;

  const [cleanupSetting, setCleanupSetting] = useState<
    Partial<SettingEntity> & {
      currentAutoCleanup: boolean;
      currentValue: string;
      autoCleanup: boolean;
      isChange?: boolean;
    }
  >({
    value: data?.data.value ?? CLEANUP_INTERVAL[2].toString(),
    currentAutoCleanup: true,
    autoCleanup: true,
    currentValue: data?.data.value ?? CLEANUP_INTERVAL[2].toString(),
  });

  const [diffDays] = useState<number>(
    (function () {
      const diffDays = Math.floor(
        (new Date().getTime() -
          new Date(
            cleanupSetting.updatedAt ?? new Date().toISOString()
          ).getTime()) /
          (1000 * 3600 * 24)
      );
      return diffDays;
    })()
  ); //* Diff days between today and the last cleanup

  const [
    { show: openConfirmDisconnectDevice, deviceId },
    setConfirmDisconnectDevice,
  ] = useState<{
    show: boolean;
    deviceId?: string;
  }>({
    show: false,
    deviceId: undefined,
  });

  const handleUpdateTwoFactorAuth = async () => {
    if (twoFactorAuth.id) {
      if (!twoFactorAuth.isChange) return;
      await updateTwoFactorAuth({
        id: twoFactorAuth.id,
        value: twoFactorAuth.currentValue.toString(),
      }).unwrap();
    }
  };

  const handleUpdateCleanup = async () => {
    if (cleanupSetting.id && cleanupSetting.id !== 0) {
      if (!cleanupSetting.isChange) return;
      await updateDinamicCleanUp({
        id: cleanupSetting.id,
        value: cleanupSetting.currentAutoCleanup
          ? cleanupSetting.currentValue.toString()
          : null,
      })
        .unwrap()
        .then(() => {
          setCleanupSetting({
            ...cleanupSetting,
            isChange: false,
          });
        });
    }
  };

  const handleUpdateMaxActiveSessions = async () => {
    if (deviceLimitID) {
      if (!isChangeDeviceLimit) return;
      await updateMaxActiveSessions({
        id: deviceLimitID,
        value: maxActiveSessionSetting.currentValue.toString(),
      })
        .unwrap()
        .then(() => {
          setMaxActiveSessionSetting({
            ...maxActiveSessionSetting,
            isChange: false,
          });
        });
    }
  };

  const handleSaveChanges = async () => {
    Promise.all([
      handleUpdateTwoFactorAuth(),
      handleUpdateCleanup(),
      handleUpdateMaxActiveSessions(),
    ]).then(() => {
      startShowSuccess("Cambios guardados correctamente");
      setShowModal(false);
    });
  };

  useEffect(() => {
    const { value, id } = getSettingByKey(
      SettingKeyEnum.TWO_FACTOR_AUTH,
      authUser?.settings
    ) ?? {
      id: undefined,
      value: false,
    };
    setTwoFactorAuth({
      id,
      value: value === "true",
      currentValue: value === "true",
    });

    const { id: idSessions, value: valueSessions } = getSettingByKey(
      SettingKeyEnum.MAX_ACTIVE_SESSIONS,
      authUser?.settings
    ) ?? {
      id: undefined,
      value: DEVICES_LIMIT[0],
    };
    setMaxActiveSessionSetting({
      id: idSessions,
      value: Number(valueSessions ?? Infinity),
      currentValue: Number(valueSessions ?? Infinity),
    });
  }, [authUser]);

  useEffect(() => {
    if (!data?.data) return;
    if (cleanupSetting.id !== 0) {
      setCleanupSetting({
        value: data?.data.value ?? CLEANUP_INTERVAL[2].toString(),
        key: SettingKeyEnum.DATA_CLEANUP_PERIOD,
        autoCleanup: !!data?.data.value,
        currentAutoCleanup: !!data?.data.value,
        id: data.data.id,
        updatedAt: data?.data.updatedAt ?? null,
        updatedBy: data?.data.updatedBy,
        currentValue: data?.data.value ?? CLEANUP_INTERVAL[2].toString(),
      });
    }
  }, [data]);

  const footer = (
    <div className="flex justify-end gap-2">
      <Button
        label="Guardar Cambios"
        icon="pi pi-check"
        loading={
          isLoadingUpdateDinamicCleanUp ||
          isLoadingUpdateMaxActiveSessions ||
          isLoadingUpdateTwoFactorAuth
        }
        onClick={handleSaveChanges}
        disabled={
          !cleanupSetting.isChange &&
          !isChangeDeviceLimit &&
          !twoFactorAuth.isChange
        }
        className="p-button-primary"
        autoFocus
      />
      <Button
        label="Cancelar"
        icon="pi pi-times"
        onClick={() => setShowModal(false)}
        className="p-button-secondary"
      />
    </div>
  );

  return (
    <>
      <DisconnectSessionDevice
        showModal={openConfirmDisconnectDevice}
        setShowModal={setConfirmDisconnectDevice}
        deviceId={deviceId}
      />
      <Dialog
        header="Configuración del Sistema"
        visible={showModal}
        className="w-full max-w-2xl"
        footer={footer}
        onHide={() => setShowModal(false)}
      >
        <div>
          <p className="text-gray-600 mb-6">
            Administra la configuración avanzada de tu cuenta y dispositivos.
          </p>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-shield text-green-500"></i>
              <h4 className="text-lg font-semibold">
                Configuración de Seguridad
              </h4>
            </div>

            <div className="bg-gray-50 flex gap-5 justify-between flex-wrap rounded-lg p-4">
              <div className="mb-4">
                <h5 className="mb-1 font-semibold">
                  Autenticación de dos factores (2FA)
                </h5>
                <p className="text-gray-600 text-sm mb-2">
                  Protección adicional activada para tu cuenta
                </p>
              </div>

              <div className="mb-4">
                <InputSwitch
                  checked={twoFactorAuth.currentValue}
                  onChange={(e) => {
                    setTwoFactorAuth({
                      ...twoFactorAuth,
                      currentValue: e.value,
                      isChange: e.value !== twoFactorAuth.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <i className="pi pi-wifi text-blue-500"></i>
              <h4 className="text-lg font-semibold">Dispositivos Conectados</h4>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="mb-4">
                <h3 className="mb-1 font-semibold">Límite de dispositivos</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Máximo número de dispositivos permitidos
                </p>
                <div className="flex items-center md:justify-between gap-3 flex-wrap">
                  <Dropdown
                    options={DEVICES_LIMIT}
                    value={maxActiveSessionSetting.currentValue}
                    onChange={(e) => {
                      if (e.value < (authUser?.activeDevices?.length ?? 0)) {
                        startShowError(
                          "No puedes desactivar el límite de dispositivos si tienes más dispositivos conectados"
                        );
                        return;
                      }
                      setMaxActiveSessionSetting({
                        ...maxActiveSessionSetting,
                        currentValue: e.value,
                        isChange: e.value !== maxActiveSessionSetting.value,
                      });
                    }}
                    valueTemplate={(item) =>
                      item !== Infinity ? (
                        <>Máximo {item} dispositivos</>
                      ) : (
                        "Ilimitado"
                      )
                    }
                    itemTemplate={(item) =>
                      item !== Infinity ? (
                        <>Máximo {item} dispositivos</>
                      ) : (
                        "Ilimitado"
                      )
                    }
                    checkmark
                    placeholder="Selecciona un límite"
                  />

                  {devicesLimit !== Infinity && (
                    <span className="text-sm text-gray-500">
                      Actualmente: {authUser?.activeDevices?.length} de{" "}
                      {devicesLimit} dispositivos utilizados
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {authUser?.activeDevices?.map((device) => {
                  return (
                    <div
                      key={device.id}
                      className="flex items-center justify-between bg-white p-3 rounded"
                    >
                      <div className="flex items-center gap-3">
                        {/* device.model === "Android" || device.model === "iOS" */}
                        <i
                          className={cn(
                            " text-gray-600 pi",
                            device.model === "Android" || device.model === "iOS"
                              ? "pi-mobile"
                              : "pi-desktop"
                          )}
                        />

                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-gray-500 text-sm">
                            {device.model} • Versión: {device.version}
                          </p>
                          {!device.isOnline && (
                            <p className="text-gray-500 text-xs">
                              Última conexión:{" "}
                              {messageTimestamp(device.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-1 rounded text-sm",
                            device.isOnline
                              ? "bg-green-100 text-green-600 "
                              : "bg-gray-100 text-gray-600"
                          )}
                        >
                          {device.isOnline ? "Activo" : "Inactivo"}
                        </span>

                        {currentDeviceKey !== device.id && (
                          <Button
                            icon="pi pi-times"
                            className="text-gray-400"
                            text
                            onClick={() => {
                              setConfirmDisconnectDevice({
                                show: true,
                                deviceId: device.id,
                              });
                            }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {isManager && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="pi pi-database text-orange-500"></i>
                <h4 className="text-lg font-semibold">
                  Gestión de Almacenamiento
                </h4>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Limpieza automática</p>
                    <p className="text-gray-600 text-sm">
                      Eliminar archivos temporales cada{" "}
                      {cleanupSetting.currentValue} días
                    </p>

                    {cleanupSetting.currentAutoCleanup ? (
                      <p className="text-green-500 text-sm mt-1">
                        Activado - {diffDays}/{cleanupSetting.currentValue} días
                        transcurridos
                      </p>
                    ) : (
                      <p className="text-red-500 text-sm mt-1">Desactivado</p>
                    )}
                  </div>

                  <InputSwitch
                    checked={cleanupSetting.currentAutoCleanup}
                    onChange={(e) => {
                      setCleanupSetting((prev) => {
                        return {
                          ...prev,
                          currentAutoCleanup: e.value,
                          isChange: prev.autoCleanup !== e.value,
                        };
                      });
                    }}
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mt-4">
                  <div className="flex items-center gap-2">
                    <i className="pi pi-clock text-blue-500"></i>
                    <span className="text-sm font-medium">
                      Última modificación
                    </span>
                  </div>
                  <div className="mt-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Usuario:</span>
                      {cleanupSetting.updatedBy ? (
                        <UserInfo
                          user={cleanupSetting.updatedBy}
                          extraInfo={"email"}
                        />
                      ) : (
                        <span>SISTEMA</span>
                      )}
                    </div>

                    {cleanupSetting.updatedAt && (
                      <div className="flex justify-between mt-2 text-gray-600">
                        <span>Fecha:</span>
                        {dateFnsAdapter.format(
                          new Date(cleanupSetting.updatedAt),
                          "dd/MM/yyyy HH:mm"
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mt-3">
                <Dropdown
                  className="w-full"
                  value={+cleanupSetting.currentValue}
                  disabled={!cleanupSetting.currentAutoCleanup}
                  onChange={(e) => {
                    setCleanupSetting((prev) => ({
                      ...prev,
                      currentValue: e.value,
                      isChange: e.value !== prev.value,
                    }));
                  }}
                  valueTemplate={(item) => <>Cada {item} días</>}
                  options={CLEANUP_INTERVAL}
                  itemTemplate={(item) => <>Cada {item} días</>}
                  checkmark
                  placeholder="Selecciona un límite"
                />
              </div>
            </div>
          )}
        </div>
      </Dialog>
    </>
  );
};

const getSettingByKey = (
  key: SettingKeyEnum,
  settings?: SettingEntity[]
): SettingEntity | undefined => {
  return settings?.find((setting) => setting.key === key);
};
